/* compiler/parser2/pascal
--------------------------------------------------------------------------------
called by parser2; lexemes making up the atoms of a routine go in, inner
pcode for that routine comes out
--------------------------------------------------------------------------------
*/

const atoms = require('./atoms');
const find = require('./find');
const pcoder = require('./pcoder');

// pseudo-constructor for errors
// ----------
const newError = (errorId, messageId, lexeme) => {
  const messages = {
    ifExpression: '"IF" must be followed by a boolean expression.',
    ifThen: '"IF ..." must be followed by "THEN".',
    ifColon: '"IF ..." must be followed by a colon ":".',
    ifColonLine: 'Colon ":" must be on the same line as "IF".',
    ifNothing: 'No commands found after "IF".',
    elseNothing: 'No commands found after "ELSE".',
    forVariable: '"FOR" must be followed by an integer variable.',
    forTurtle: 'Turtle attribute cannot be used as a "FOR" variable.',
    forNotFound: `Variable "${lexeme.string}" not defined.`,
    forNotInteger: `"${lexeme.string}" is not an integer variable.`,
    forAssignment: '"FOR" variable must be assigned an initial value.',
    forEquals: 'Assignment operator is ":=", not "=".',
    forInitial: '"FOR" loop variable must be assigned an initial value.',
    forToDownTo: '"FOR ... := ..." must be followed by "TO" or "DOWNTO".',
    forToNothing: `"${lexeme.string.toUpperCase()}" must be followed by an integer (or integer constant).`,
    forStep: '"STEP" instruction must be of the form "STEP -1".',
    forDo: '"FOR" loop range must be followed by "DO".',
    forNothing: 'No commands found after "FOR" loop initialisation.',
    repeatExpression: '"UNTIL" must be followed by a boolean expression.',
    whileExpression: '"WHILE" must be followed by a boolean expression.',
    whileDo: '"WHILE ..." must be followed by "DO".',
    whileNothing: 'No commands found after "WHILE ... DO".',
    blockNothing: 'No commands found after "BEGIN".',
    blockBegin: `"END" expected, not "${lexeme.type.toUpperCase()}".`,
    blockIf: `"ENDIF" expected, not "${lexeme.type.toUpperCase()}".`,
    blockFor: `"NEXT" expected, not "${lexeme.type.toUpperCase()}".`,
    blockRepeat: `"UNTIL" expected, not "${lexeme.type.toUpperCase()}".`,
    blockWhile: `"ENDWHILE" expected, not "${lexeme.type.toUpperCase()}".`,
    blockNoEnd: '"BEGIN" does not have any matching "END".',
    cmdEqal: 'Variable assignment requires ":=" rather than "=".',
    cmdColon: 'Command must be on a new line, or followed by a colon.',
    cmdSemicolon: 'Semicolon needed after command.',
    cmdNewLine: 'Command must be on a new line.',
    cmdWeird: `Command cannot begin with "${lexeme.string}".`,
  };
  return {
    id: errorId,
    messageId: messageId,
    message: messages[messageId],
    lexeme: lexeme
  };
};

// psuedo-constructor for block end errors
// ----------
const newBlockEndError = (start, lexeme) => {
  switch (start) {
    case 'begin':
      return newError('block02', 'blockBegin', lexeme);
    case 'if': // fallthrough
    case 'else':
      return newError('block03', 'blockIf', lexeme);
    case 'for':
      return newError('block04', 'blockFor', lexeme);
    case 'repeat':
      return newError('block05', 'blockRepeat', lexeme);
    case 'while':
      return newError('block06', 'blockWhile', lexeme);
  }
};

// check if the current lexeme is 'else'
// ----------
const elseCheck = (language, lexemes, lex) => {
  if (!lexemes[lex]) return false;
  if (lexemes[lex].type !== 'else') return false;
  return true;
};

// generate the pcode for an IF structure
// ----------
const compileIf = (routines, sub, lex, addresses, offset) => {
  const lexemes = routines[sub].lexemes;
  const pcode = [];
  const result = {};
        var ifnoLine = 0;
        var elseJump = 0;
        var oneLine = true; // for BASIC only
        // if we're here, the previous lexeme was IF
        // so now we're expecting a boolean expression
        if (!lexemes[lex]) {
            throw newError('if01', 'ifExpression', lexemes[lex - 1]);
        }
        // must be on the same line for Python
        if (language === 'Python') {
            if (lexemes[lex].line > lexemes[lex - 1].line) {
                throw newError('if06', 'ifColonLine', lexemes[lex]);
            }
        }
        // evaluate the boolean expression
        result = commands.expression(routines, sub, lex, addresses, 'null', 'bool', false);
        lex = result.lex;
        pcode = result.pcode;
        // push IFNO to the end of the pcode, and save the line for fixing the
        // jump later
        ifnoLine = pcode.length - 1;
        pcode[ifnoLine].push(pc.ifno);
        // now we're expecting THEN (BASIC and Pascal) or a colon (Python)
        switch (language) {
        case 'BASIC': // fallthrough
        case 'Pascal':
            if (!lexemes[lex]) {
                throw newError('if02', 'ifThen', lexemes[lex - 1]);
            }
            if (lexemes[lex].type !== 'then') {
                throw newError('if03', 'ifThen', lexemes[lex]);
            }
            break;
        case 'Python':
            if (!lexemes[lex]) {
                throw newError('if04', 'ifColon', lexemes[lex - 1]);
            }
            if (lexemes[lex].type !== 'colon') {
                throw newError('if05', 'ifColon', lexemes[lex]);
            }
            if (lexemes[lex].line > lexemes[lex - 1].line) {
                throw newError('if06', 'ifColonLine', lexemes[lex]);
            }
            break;
        }
        // expecting some commands next
        lex += 1;
        if (!lexemes[lex]) {
            throw newError('if07', 'ifNothing', lexemes[lex]);
        }
        // now things are a bit different for the different languages ...
        switch (language) {
        case 'BASIC':
            if (lexemes[lex].line > lexemes[lex - 1].line) {
                // if we're on a new line, expect a block of structures
                result = block(routines, sub, lex, addresses, offset + pcode.length, 'if', null);
                // and set oneLine to false, so we know to check that any
                // subsequent ELSE is on a new line
                oneLine = false;
            } else {
                // otherwise just expect a single structure
                result = structure(routines, sub, lex, addresses, offset + pcode.length);
            }
            break;
        case 'Pascal':
            if (lexemes[lex].type === 'begin') {
                // if there's a BEGIN, expect a block of structures
                result = block(routines, sub, lex + 1, addresses, offset + pcode.length, 'begin', null);
            } else {
                // otherwise just expect a single structure
                result = structure(routines, sub, lex, addresses, offset + pcode.length);
            }
            break;
        case 'Python':
            // always treat what follows as a block in Python, except the block
            // may consist of just a single command - it makes no difference
            result = block(routines, sub, lex, addresses, offset + pcode.length, null, lexemes[lex].indent);
            break;
        }
        lex = result.lex;
        pcode = pcode.concat(result.pcode);
        // ? ... ELSE ... ?
        if (elseCheck(language, lexemes, lex, oneLine)) {
            lex += 1; // move past 'else'
            if (!lexemes[lex]) {
                throw newError('if04', 'elseNothing', lexemes[lex]);
            }
            elseJump = pcode.length;
            pcode.push([pc.jump]);
            // now things are a bit different for the different languages
            switch (language) {
            case 'BASIC':
                if (lexemes[lex].line > lexemes[lex - 1].line) {
                    // if we're on a new line, expect a block of structures
                    result = block(routines, sub, lex, addresses, offset + pcode.length, 'else', null);
                } else {
                    // otherwise just expect a single structure
                    result = structure(routines, sub, lex, addresses, offset + pcode.length);
                }
                break;
            case 'Pascal':
                if (lexemes[lex].type === 'begin') {
                    // if there's a BEGIN, expect a block of structures
                    result = block(routines, sub, lex + 1, addresses, offset + pcode.length, 'begin', null);
                } else {
                    // otherwise just expect a single structure
                    result = structure(routines, sub, lex, addresses, offset + pcode.length);
                }
                break;
            case 'Python':
                // always treat what follows as a block in Python, except the block
                // may consist of just a single command - it makes no difference
                result = block(routines, sub, lex, addresses, offset + pcode.length, null, lexemes[lex].indent);
                break;
            }
            lex = result.lex;
            pcode = pcode.concat(result.pcode);
            pcode[elseJump].push(offset + pcode.length + 1);
            pcode[ifnoLine].push(offset + elseJump + 2);
        } else {
            // no ELSE, just finish the IF
            pcode[ifnoLine].push(offset + pcode.length + 1);
        }
        return {lex: lex, pcode: pcode};
    };

    // generate the pcode for a FOR structure
    // ----------
    compileFor = function (routines, sub, lex, addresses, offset) {
        var language = routines[0].language;
        var lexemes = routines[sub].lexemes;
        var pcode = [];
        var result = {};
        var variable = {};
        var increment = 0;
        if (!lexemes[lex]) {
            throw newError('for01', 'forVariable', lexemes[lex - 1]);
        }
        if (lexemes[lex].type === 'turtle') {
            throw newError('for02', 'forTurtle', lexemes[lex]);
        }
        if (lexemes[lex].type !== 'identifier') {
            throw newError('for03', 'forVariable', lexemes[lex]);
        }
        variable = find.variable(routines, sub, lexemes[lex].string);
        if (!variable) {
            throw newError('for04', 'forNotFound', lexemes[lex]);
        }
        if ((variable.type !== 'int') && (variable.type !== 'boolint')) {
            throw newError('for05', 'forNotInteger', lexemes[lex]);
        }
        if (!lexemes[lex + 1]) {
            throw newError('for06', 'forAssignment', lexemes[lex]);
        }
        lex += 1;
        switch (language) {
        case 'BASIC':
            if (lexemes[lex].type !== 'eqal') {
                throw newError('for08', 'forAssignment', lexemes[lex]);
            }
            break;
        case 'Pascal':
            if (lexemes[lex].type === 'eqal') {
                throw newError('for07', 'forEquals', lexemes[lex]);
            }
            if (lexemes[lex].type !== 'asgn') {
                throw newError('for08', 'forAssignment', lexemes[lex]);
            }
            break;
        case 'Python':
            // WIP ...
            break;
        }
        if (!lexemes[lex + 1]) {
            throw newError('for09', 'forInitial', lexemes[lex]);
        }
        lex += 1;
        result = commands.expression(routines, sub, lex, addresses, 'null', 'int', false);
        lex = result.lex;
        pcode = result.pcode;
        pcode.push(values.storeVariable(variable));
        if (!lexemes[lex]) {
            throw newError('for10', 'forToDownTo', lexemes[lex - 1]);
        }
        switch (lexemes[lex].type) {
        case 'to':
            increment = 1;
            break;
        case 'downto':
            increment = -1;
            break;
        default:
            throw newError('for11', 'forToDownTo', lexemes[lex]);
        }
        if (!lexemes[lex + 1]) {
            throw newError('for12', 'forToNothing', lexemes[lex]);
        }
        lex += 1;
        result = commands.expression(routines, sub, lex, addresses, 'null', 'int', false);
        lex = result.lex;
        pcode[pcode.length - 1] = pcode[pcode.length - 1].concat(result.pcode.shift());
        pcode = pcode.concat(result.pcode);
        // for Pascal, we already know the increment; for BASIC, we may now
        // need to change the default...
        if (language === 'BASIC') {
            if (lexemes[lex] && lexemes[lex].type === 'step') {
                if (!lexemes[lex + 1]) {
                    throw newError('for13', 'forStep', lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].type !== 'subt') {
                    throw newError('for14', 'forStep', lexemes[lex]);
                }
                if (!lexemes[lex + 1]) {
                    throw newError('for15', 'forStep', lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].string !== '1') {
                    throw newError('for16', 'forStep', lexemes[lex]);
                }
                lex += 1;
                increment = -1;
            }
        }
        pcode.push(values.loadVariable(variable, false));
        if (increment > 0) {
            pcode[pcode.length - 1].push(pc.mreq);
        } else {
            pcode[pcode.length - 1].push(pc.lseq);
        }
        pcode[pcode.length - 1].push(pc.ifno);
        // Pascal requires DO at this point
        if (language === 'Pascal') {
            if (!lexemes[lex]) {
                throw newError('for17', 'forDo', lexemes[lex - 1]);
            }
            if (lexemes[lex].type !== 'do') {
                throw newError('for18', 'forDo', lexemes[lex]);
            }
            lex += 1;
        }
        if (!lexemes[lex]) {
            throw newError('for19', 'forNothing', lexemes[lex]);
        }
        switch (language) {
        case 'BASIC':
            if (lexemes[lex - 1].line < lexemes[lex].line) {
                result = block(routines, sub, lex, addresses, offset + pcode.length, 'for');
            } else {
                result = structure(routines, sub, lex, addresses, offset + pcode.length);
            }
            break;
        case 'Pascal':
            if (lexemes[lex].type === 'begin') {
                result = block(routines, sub, lex + 1, addresses, offset + pcode.length, 'begin');
            } else {
                result = structure(routines, sub, lex, addresses, offset + pcode.length);
            }
            break;
        case 'Python':
            break;
        }
        lex = result.lex;
        pcode = pcode.concat(result.pcode);
        pcode.push(values.loadVariable(variable));
        if (increment > 0) {
            pcode[pcode.length - 1].push(pc.incr);
        } else {
            pcode[pcode.length - 1].push(pc.decr);
        }
        pcode[pcode.length - 1].push(pc.jump);
        pcode[pcode.length - 1].push(offset + 2);
        pcode[2].push(offset + pcode.length + 1); // backpatch initial IFNO jump
        return {lex: lex, pcode: pcode};
    };

    // generate the pcode for a REPEAT structure
    // ----------
    compileRepeat = function (routines, sub, lex, addresses, offset) {
        var lexemes = routines[sub].lexemes;
        var pcode = [];
        var result = {};
        result = block(routines, sub, lex, addresses, offset + pcode.length, 'repeat');
        lex = result.lex;
        pcode = pcode.concat(result.pcode);
        if (!lexemes[lex]) {
            throw newError('repeat01', 'repeatExpression', lexemes[lex - 1]);
        }
        result = commands.expression(routines, sub, lex, addresses, 'null', 'bool', false);
        lex = result.lex;
        pcode = pcode.concat(result.pcode);
        pcode[pcode.length - 1].push(pc.ifno);
        pcode[pcode.length - 1].push(offset + 1);
        return {lex: lex, pcode: pcode};
    };

    // generate the pcode for a WHILE structure
    // ----------
    compileWhile = function (routines, sub, lex, addresses, offset) {
        var language = routines[0].language;
        var lexemes = routines[sub].lexemes;
        var pcode = [];
        var result = {};
        var ifnoLine = 0;
        if (!lexemes[lex]) {
            throw newError('while01', 'whileExpression', lexemes[lex - 1]);
        }
        result = commands.expression(routines, sub, lex, addresses, 'null', 'bool', false);
        lex = result.lex;
        pcode = result.pcode;
        ifnoLine = pcode.length - 1;
        pcode[ifnoLine].push(pc.ifno);
        if (language === 'Pascal') { // Pascal requires DO after WHILE expression
            if (!lexemes[lex]) {
                throw newError('while02', 'whileDo', lexemes[lex - 1]);
            }
            if (lexemes[lex].type !== 'do') {
                throw newError('while03', 'whileDo', lexemes[lex]);
            }
            lex += 1;
        }
        if (!lexemes[lex]) {
            throw newError('while04', 'whileNothing', lexemes[lex]);
        }
        switch (language) {
        case 'BASIC':
            if (lexemes[lex].line > lexemes[lex - 1].line) {
                result = block(routines, sub, lex, addresses, offset + pcode.length, 'while');
            } else {
                result = structure(routines, sub, lex, addresses, offset + pcode.length);
            }
            break;
        case 'Pascal':
            if (lexemes[lex].type === 'begin') {
                result = block(routines, sub, lex + 1, addresses, offset + pcode.length, 'begin');
            } else {
                result = structure(routines, sub, lex, addresses, offset + pcode.length);
            }
            break;
        case 'Python':
            // WIP ...
            break;
        }
        lex = result.lex;
        pcode = pcode.concat(result.pcode);
        pcode.push([pc.jump, offset + 1]);
        pcode[ifnoLine].push(offset + pcode.length + 1);
        return {lex: lex, pcode: pcode};
    };

    // check whether something looks like an assignment, and throw an error
    // if it's the wrong operator
    // ----------
    assignmentCheck = function (language, lexeme) {
        switch (language) {
        case 'BASIC':
            // BASIC '=' is ambiguous between assignment and equality
            if (lexeme.type === 'eqal') {
                return true;
            }
            break;
        case 'Pascal':
            // Pascal distinguishes between ':=' and '='
            if (lexeme.type === 'eqal') {
                throw newError('cmd01', 'cmdEqalPascal', lexeme);
            }
            if (lexeme.type === 'asgn') {
                return true;
            }
            break;
        case 'Python':
            // Python distinguishes between '=' and '=='
            if (lexeme.type === 'eqal') {
                throw newError('cmd02', 'cmdEqalPython', lexeme);
            }
            if (lexeme.type === 'asgn') {
                return true;
            }
            break;
        }
        return false;
    };

    // check for the ending to a block of structures, and throw an error
    // if it doesn't match the beginning
    // ----------
    blockEndCheck = function (start, lexeme) {
        switch (lexeme.type) {
        case 'end':
            if (start !== 'begin') {
                throw newBlockEndError(start, lexeme);
            }
            return true;
        case 'else':
            if (start !== 'if') {
                throw newBlockEndError(start, lexeme);
            }
            return true;
        case 'endif':
            if ((start !== 'if') && (start !== 'else')) {
                throw newBlockEndError(start, lexeme);
            }
            return true;
        case 'next':
            if (start !== 'for') {
                throw newBlockEndError(start, lexeme);
            }
            return true;
        case 'until':
            if (start !== 'repeat') {
                throw newBlockEndError(start, lexeme);
            }
            return true;
        case 'endwhile':
            if (start !== 'while') {
                throw newBlockEndError(start, lexeme);
            }
            return true;
        }
        return false;
    };

    // generate the pcode for a block (i.e. a sequence of structures)
    // ----------
    // this will loop through compiling structures until the end of the block
    // the end of the block is determined by an appropriate START lexeme in
    // BASIC and Pascal, and by the INDENT in Python
    block = function (routines, sub, lex, addresses, offset, start, indent) {
        const language = routines[0].language;
        const lexemes = routines[sub].lexemes;
        var pcode = [];
        var result = {};
        var end = false;
        // expecting something
        if (!lexemes[lex]) {
            throw newError('block01', 'blockNothing', lexemes[lex - 1]);
        }
        // loop through until the end of the block (or we run out of lexemes)
        while (!end && (lex < lexemes.length)) {
            if (language === 'Python') {
                // Python indicates the end of a block with indentation
                end = (lexemes[lex].indent < indent);
            } else {
                // BASIC and Pascal indicate it with the lexeme itself
                end = blockEndCheck(start, lexemes[lex]);
            }
            if (end) {
                // we might need to move past the lexeme, if all it does is
                // indicate the end of the block
                switch (language) {
                case 'BASIC':
                    // needed unless the lexeme is ELSE
                    if (lexemes[lex].type !== 'else') {
                        lex += 1;
                    }
                    break;
                case 'Pascal':
                    // always needed
                    lex += 1;
                    break;
                case 'Python':
                    // never needed
                    break;
                }
            } else {
                // compile the structure
                result = structure(routines, sub, lex, addresses, offset + pcode.length);
                lex = result.lex;
                pcode = pcode.concat(result.pcode);
            }
        }
        // if we've run out of lexemes without reaching the end, this could be
        // fine for Python, but doesn't make sense for BASIC or Pascal
        if (!end && (language !== 'Python')) {
            throw newError('block07', 'blockNoEnd', lexemes[lex - 1]);
        }
        return {lex: lex, pcode: pcode};
    };

    // generate the pcode for a command structure
    // ----------
    // a command structure is either a single command (variable assignment or
    // procedure call) or some more complex structure (if, for, while, etc.)
    // containing a series of such single commands - in the latter case, the
    // function for dealing with the more complex structure calls this function
    // again, potentially recursively, allowing for structures of indefinite
    // complexity
    // ----------
    structure = function (routines, sub, lex, addresses, offset) {
        const language = routines[0].language;
        const lexemes = routines[sub].lexemes;
        const noSemiAfter = ['begin', 'do', 'dot', 'repeat', 'semicolon', 'then'];
        const noSemiBefore = ['else', 'end', 'semicolon', 'until'];
        var pcode = [];
        var result = {};
        switch (lexemes[lex].type) {
        // identifiers (assignment or procedure call)
        case 'turtle': // fallthrough
        case 'result': // fallthrough
        case 'identifier':
            if (assignmentCheck(language, lexemes[lex + 1])) {
                // looks like an assignment
                result = commands.assignment(routines, sub, lex, addresses);
            } else {
                // otherwise it should be a procedure call
                result = commands.command(routines, sub, lex, addresses, 'procedure');
            }
            lex = result.lex;
            pcode = result.pcode;
            break;
        // start of IF structure
        case 'if':
            result = compileIf(routines, sub, lex + 1, addresses, offset);
            lex = result.lex;
            pcode = result.pcode;
            break;
        // start of FOR structure
        case 'for':
            result = compileFor(routines, sub, lex + 1, addresses, offset);
            lex = result.lex;
            pcode = result.pcode;
            break;
        // start of REPEAT structure
        case 'repeat':
            result = compileRepeat(routines, sub, lex + 1, addresses, offset);
            lex = result.lex;
            pcode = result.pcode;
            break;
        // start of WHILE structure
        case 'while':
            result = compileWhile(routines, sub, lex + 1, addresses, offset);
            lex = result.lex;
            pcode = result.pcode;
            break;
        // any thing else is a mistake
        default:
            throw newError('cmd06', 'cmdWeird', lexemes[lex]);
        }
        // if we haven't run out of lexemes, check for the appropriate
        // structure ending
        if (lexemes[lex]) {
            switch (language) {
            case 'BASIC':
                // check for a colon or a new line, and move past any colons
                if (lexemes[lex].type !== 'colon') {
                    if (lexemes[lex].line === lexemes[lex - 1].line) {
                        if (lexemes[lex].type !== 'else') {
                            throw newError('cmd03', 'cmdColon', lexemes[lex - 1]);
                        }
                    }
                } else {
                    while (lexemes[lex] && (lexemes[lex].type === 'colon')) {
                        lex += 1;
                    }
                }
                break;
            case 'Pascal':
                // check for a semicolon (if needed), and move past any semicolons
                if (lexemes[lex].type !== 'semicolon') {
                    if (noSemiAfter.indexOf(lexemes[lex - 1].type) === -1) {
                        if (noSemiBefore.indexOf(lexemes[lex].type) === -1) {
                            throw newError('cmd04', 'cmdSemicolon', lexemes[lex]);
                        }
                    }
                } else {
                    while (lexemes[lex] && lexemes[lex].type === 'semicolon') {
                        lex += 1;
                    }
                }
                break;
            case 'Python':
                // check for a new line
                if (lexemes[lex].line === lexemes[lex - 1].line) {
                    throw newError('cmd05', 'cmdNewLine', lexemes[lex]);
                }
                break;
            }
        }
        return {lex: lex, pcode: pcode};
    };

    // generate the pcode for a routine
    // ----------
    // routines consist of a sequence of 'structures', the pcode for each of
    // which is generated by the structure function; this function just loops
    // through the lexemes calling that structure function repeatedly
    // ----------
    structures = function (routines, sub, addresses, offset) {
        var lex = 0;
        var pcode = [];
        var result = {};
        while (lex < routines[sub].lexemes.length) {
            result = structure(routines, sub, lex, addresses, offset + pcode.length);
            lex = result.lex;
            pcode = pcode.concat(result.pcode);
        }
        return pcode;
    };

    return structures;

});
