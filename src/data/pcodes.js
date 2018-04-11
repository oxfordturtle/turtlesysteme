/*
 * machine pcodes
 */
const newPCode = (code, args, str) =>
  ({ code, args, str });

module.exports = ([
  // 0x00s - basic stack operations, boolean operators
  newPCode(0x00, 0, 'NULL'),
  newPCode(0x01, 0, 'DUPL'),
  newPCode(0x02, 0, 'SWAP'),
  newPCode(0x03, 0, 'ROTA'),
  newPCode(0x04, 0, 'INCR'),
  newPCode(0x05, 0, 'DECR'),
  undefined, // 0x06
  undefined, // 0x07
  newPCode(0x08, 0, 'NOT'),
  newPCode(0x09, 0, 'AND'),
  newPCode(0x0A, 0, 'OR'),
  newPCode(0x0B, 0, 'XOR'),
  undefined, // 0x0C
  undefined, // 0x0D
  undefined, // 0x0E
  undefined, // 0x0F
  // 0x10s - integer operators
  newPCode(0x10, 0, 'NEG'),
  newPCode(0x11, 0, 'ABS'),
  newPCode(0x12, 0, 'SIGN'),
  newPCode(0x13, 0, 'RAND'),
  undefined, // 0x14
  undefined, // 0x15
  undefined, // 0x16
  undefined, // 0x17
  newPCode(0x18, 0, 'PLUS'),
  newPCode(0x19, 0, 'SUBT'),
  newPCode(0x1A, 0, 'MULT'),
  newPCode(0x1B, 0, 'DIVR'),
  newPCode(0x1C, 0, 'DIV'),
  newPCode(0x1D, 0, 'MOD'),
  undefined, // 0x1E
  undefined, // 0x1F
  // 0x20s - pseudo-real operators
  newPCode(0x20, 0, 'DIVM'),
  newPCode(0x21, 0, 'SQRT'),
  newPCode(0x22, 0, 'HYP'),
  newPCode(0x23, 0, 'ROOT'),
  newPCode(0x24, 0, 'POWR'),
  newPCode(0x25, 0, 'LOG'),
  newPCode(0x26, 0, 'ALOG'),
  newPCode(0x27, 0, 'LN'),
  newPCode(0x28, 0, 'EXP'),
  newPCode(0x29, 0, 'SIN'),
  newPCode(0x2A, 0, 'COS'),
  newPCode(0x2B, 0, 'TAN'),
  newPCode(0x2C, 0, 'ASIN'),
  newPCode(0x2D, 0, 'ACOS'),
  newPCode(0x2E, 0, 'ATAN'),
  newPCode(0x2F, 0, 'PI'),
  // 0x30s - string operators
  newPCode(0x30, 0, 'CTOS'),
  newPCode(0x31, 0, 'ITOS'),
  newPCode(0x32, 0, 'HEXS'),
  newPCode(0x33, 0, 'SVAL'),
  newPCode(0x34, 0, 'QTOS'),
  newPCode(0x35, 0, 'QVAL'),
  newPCode(0x36, 0, 'SCAT'),
  newPCode(0x37, 0, 'SLEN'),
  newPCode(0x38, 0, 'CASE'),
  newPCode(0x39, 0, 'COPY'),
  newPCode(0x3A, 0, 'DELS'),
  newPCode(0x3B, 0, 'INSS'),
  newPCode(0x3C, 0, 'POSS'),
  newPCode(0x3D, 0, 'REPL'),
  undefined, // 0x3E
  undefined, // 0x3F
  // 0x40s - comparison operators
  newPCode(0x40, 0, 'EQAL'),
  newPCode(0x41, 0, 'NOEQ'),
  newPCode(0x42, 0, 'LESS'),
  newPCode(0x43, 0, 'MORE'),
  newPCode(0x44, 0, 'LSEQ'),
  newPCode(0x45, 0, 'MREQ'),
  newPCode(0x46, 0, 'MAXI'),
  newPCode(0x47, 0, 'MINI'),
  newPCode(0x48, 0, 'SEQL'),
  newPCode(0x49, 0, 'SNEQ'),
  newPCode(0x4A, 0, 'SLES'),
  newPCode(0x4B, 0, 'SMOR'),
  newPCode(0x4C, 0, 'SLEQ'),
  newPCode(0x4D, 0, 'SMEQ'),
  newPCode(0x4E, 0, 'SMAX'),
  newPCode(0x4F, 0, 'SMIN'),
  // 0x50s - loading stack
  newPCode(0x50, 1, 'LDIN'),
  newPCode(0x51, 1, 'LDVG'),
  newPCode(0x52, 2, 'LDVV'),
  newPCode(0x53, 2, 'LDVR'),
  newPCode(0x54, 1, 'LDAG'),
  newPCode(0x55, 2, 'LDAV'),
  undefined, // 0x56
  newPCode(0x57, -1, 'LSTR'),
  newPCode(0x58, 0, 'LDMT'),
  undefined, // 0x59
  undefined, // 0x5A
  undefined, // 0x5B
  undefined, // 0x5C
  undefined, // 0x5D
  undefined, // 0x5E
  undefined, // 0x5F
  // 0x60s - storing from stack
  newPCode(0x60, 2, 'ZERO'),
  newPCode(0x61, 1, 'STVG'),
  newPCode(0x62, 2, 'STVV'),
  newPCode(0x63, 2, 'STVR'),
  undefined, // 0x64
  undefined, // 0x65
  undefined, // 0x66
  undefined, // 0x67
  newPCode(0x68, 0, 'STMT'),
  undefined, // 0x69
  undefined, // 0x6A
  undefined, // 0x6B
  undefined, // 0x6C
  undefined, // 0x6D
  undefined, // 0x6E
  undefined, // 0x6F
  // 0x70s - pointer handling
  newPCode(0x70, 0, 'LPTR'),
  newPCode(0x71, 0, 'SPTR'),
  newPCode(0x72, 0, 'CPTR'),
  newPCode(0x73, 0, 'ZPTR'),
  undefined, // 0x74
  undefined, // 0x75
  undefined, // 0x76
  undefined, // 0x77
  newPCode(0x78, 0, 'TEST'),
  newPCode(0x79, 0, 'CSTR'),
  undefined, // 0x7A
  undefined, // 0x7B
  undefined, // 0x7C
  undefined, // 0x7D
  undefined, // 0x7E
  undefined, // 0x7F
  // 0x80s - flow control
  newPCode(0x80, 1, 'JUMP'),
  newPCode(0x81, 1, 'IFNO'),
  newPCode(0x82, 0, 'HALT'),
  undefined, // 0x83
  undefined, // 0x84
  undefined, // 0x85
  undefined, // 0x86
  undefined, // 0x87
  newPCode(0x88, 1, 'SUBR'),
  newPCode(0x89, 0, 'RETN'),
  undefined, // 0x8A
  undefined, // 0x8B
  newPCode(0x8C, 1, 'PSSR'),
  newPCode(0x8D, 0, 'PLSR'),
  newPCode(0x8E, 0, 'PSRJ'),
  newPCode(0x8F, 0, 'PLRJ'),
  // 0x90s - memory control, dummy commands
  newPCode(0x90, 2, 'MEMC'),
  newPCode(0x91, 1, 'MEMR'),
  newPCode(0x92, 0, 'HFIX'),
  newPCode(0x93, 0, 'HCLR'),
  newPCode(0x94, 0, 'HRST'),
  undefined, // 0x95
  undefined, // 0x96
  undefined, // 0x97
  newPCode(0x98, -2, 'NEWT'), // dummy code
  newPCode(0x99, -2, 'OLDT'), // dummy code
  newPCode(0x9A, -2, 'RNDC'), // dummy code
  newPCode(0x9B, -2, 'TEXL'), // dummy code
  newPCode(0x9C, -2, 'UPPC'), // dummy code
  newPCode(0x9D, -2, 'LOWC'), // dummy code
  newPCode(0x9E, -2, 'LEFS'), // dummy code
  newPCode(0x9F, -2, 'RGTS'), // dummy code
  // 0xA0s - runtime flags, text output, debugging, dummy codes
  newPCode(0xA0, 0, 'PNUP'),
  newPCode(0xA1, 0, 'PNDN'),
  newPCode(0xA2, 0, 'UDAT'),
  newPCode(0xA3, 0, 'NDAT'),
  newPCode(0xA4, 0, 'KECH'),
  undefined, // 0xA5
  newPCode(0xA6, 0, 'OUTP'),
  newPCode(0xA7, 0, 'CONS'),
  newPCode(0xA8, 0, 'TRAC'),
  newPCode(0xA9, 0, 'MEMW'),
  newPCode(0xAA, 0, 'DUMP'),
  newPCode(0xAB, -2, 'SVD0'), // dummy code
  newPCode(0xAC, -2, 'BOOL'), // dummy code
  newPCode(0xAD, -2, 'ILIN'), // dummy code
  undefined, // 0xAE
  undefined, // 0xAF
  // 0xB0s - timing, input, text output
  newPCode(0xB0, 0, 'TIME'),
  newPCode(0xB1, 0, 'TSET'),
  newPCode(0xB2, 0, 'WAIT'),
  newPCode(0xB3, 0, 'TDET'),
  undefined, // 0xB4
  undefined, // 0xB5
  undefined, // 0xB6
  undefined, // 0xB7
  newPCode(0xB8, 0, 'INPT'),
  newPCode(0xB9, 0, 'ICLR'),
  newPCode(0xBA, 0, 'BUFR'),
  newPCode(0xBB, 0, 'READ'),
  newPCode(0xBC, 0, 'RDLN'),
  newPCode(0xBD, 0, 'PRNT'),
  newPCode(0xBE, 0, 'TEXT'),
  newPCode(0xBF, 0, 'NEWL'),
  // 0xC0s - file handling (not yet implemented)
  newPCode(0xC0, 0, 'FDIR'),
  newPCode(0xC1, 0, 'OPEN'),
  newPCode(0xC2, 0, 'CLOS'),
  newPCode(0xC3, 0, 'FPTR'),
  newPCode(0xC4, 0, 'FBEG'),
  newPCode(0xC5, 0, 'EOF'),
  newPCode(0xC6, 0, 'FRDS'),
  newPCode(0xC7, 0, 'FRLN'),
  newPCode(0xC8, 0, 'FWRS'),
  newPCode(0xC9, 0, 'FWNL'),
  undefined, // 0xCA
  undefined, // 0xCB
  undefined, // 0xCC
  undefined, // 0xCD
  undefined, // 0xCE
  undefined, // 0xCF
  // 0xD0s - canvas, turtle settings
  newPCode(0xD0, 0, 'CANV'),
  newPCode(0xD1, 0, 'RESO'),
  newPCode(0xD2, 0, 'PIXC'),
  newPCode(0xD3, 0, 'PIXS'),
  newPCode(0xD4, 0, 'ANGL'),
  newPCode(0xD5, 0, 'CURS'),
  undefined, // 0xD6
  undefined, // 0xD7
  newPCode(0xD8, 0, 'HOME'),
  newPCode(0xD9, 0, 'SETX'),
  newPCode(0xDA, 0, 'SETY'),
  newPCode(0xDB, 0, 'SETD'),
  newPCode(0xDC, 0, 'THIK'),
  newPCode(0xDD, 0, 'COLR'),
  newPCode(0xDE, 0, 'RGB'),
  newPCode(0xDF, 0, 'MIXC'),
  // 0xE0s - turtle movement
  newPCode(0xE0, 0, 'TOXY'),
  newPCode(0xE1, 0, 'MVXY'),
  newPCode(0xE2, 0, 'DRXY'),
  newPCode(0xE3, 0, 'FWRD'),
  newPCode(0xE4, 0, 'BACK'),
  newPCode(0xE5, 0, 'LEFT'),
  newPCode(0xE6, 0, 'RGHT'),
  newPCode(0xE7, 0, 'TURN'),
  undefined, // 0xE8
  undefined, // 0xE9
  undefined, // 0xEA
  undefined, // 0xEB
  newPCode(0xEC, 0, 'RMBR'),
  newPCode(0xED, 0, 'FRGT'),
  undefined, // 0xEE
  undefined, // 0xEF
  // 0xF0s - shapes and fills, maximum integer
  newPCode(0xF0, 0, 'POLY'),
  newPCode(0xF1, 0, 'PFIL'),
  newPCode(0xF2, 0, 'CIRC'),
  newPCode(0xF3, 0, 'BLOT'),
  newPCode(0xF4, 0, 'ELPS'),
  newPCode(0xF5, 0, 'EBLT'),
  newPCode(0xF6, 0, 'BOX'),
  undefined, // 0xF7
  newPCode(0xF8, 0, 'BLNK'),
  undefined, // 0xF9
  undefined, // 0xFA
  undefined, // 0xFB
  newPCode(0xFC, 0, 'RCOL'),
  newPCode(0xFD, 0, 'FILL'),
  undefined, // 0xFE
  newPCode(0xFF, 0, 'MXIN'),
]);
