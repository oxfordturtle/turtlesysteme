/*
machine pcodes
*/

const pcode = (code, args, str) =>
  ({ code, args, str })

module.exports = ([
  // 0x00s - basic stack operations, boolean operators
  pcode(0x00, 0, 'NULL'),
  pcode(0x01, 0, 'DUPL'),
  pcode(0x02, 0, 'SWAP'),
  pcode(0x03, 0, 'ROTA'),
  pcode(0x04, 0, 'INCR'),
  pcode(0x05, 0, 'DECR'),
  undefined, // 0x06
  undefined, // 0x07
  pcode(0x08, 0, 'NOT'),
  pcode(0x09, 0, 'AND'),
  pcode(0x0A, 0, 'OR'),
  pcode(0x0B, 0, 'XOR'),
  undefined, // 0x0C
  undefined, // 0x0D
  undefined, // 0x0E
  undefined, // 0x0F
  // 0x10s - integer operators
  pcode(0x10, 0, 'NEG'),
  pcode(0x11, 0, 'ABS'),
  pcode(0x12, 0, 'SIGN'),
  pcode(0x13, 0, 'RAND'),
  undefined, // 0x14
  undefined, // 0x15
  undefined, // 0x16
  undefined, // 0x17
  pcode(0x18, 0, 'PLUS'),
  pcode(0x19, 0, 'SUBT'),
  pcode(0x1A, 0, 'MULT'),
  pcode(0x1B, 0, 'DIVR'),
  pcode(0x1C, 0, 'DIV'),
  pcode(0x1D, 0, 'MOD'),
  undefined, // 0x1E
  undefined, // 0x1F
  // 0x20s - pseudo-real operators
  pcode(0x20, 0, 'DIVM'),
  pcode(0x21, 0, 'SQRT'),
  pcode(0x22, 0, 'HYP'),
  pcode(0x23, 0, 'ROOT'),
  pcode(0x24, 0, 'POWR'),
  pcode(0x25, 0, 'LOG'),
  pcode(0x26, 0, 'ALOG'),
  pcode(0x27, 0, 'LN'),
  pcode(0x28, 0, 'EXP'),
  pcode(0x29, 0, 'SIN'),
  pcode(0x2A, 0, 'COS'),
  pcode(0x2B, 0, 'TAN'),
  pcode(0x2C, 0, 'ASIN'),
  pcode(0x2D, 0, 'ACOS'),
  pcode(0x2E, 0, 'ATAN'),
  pcode(0x2F, 0, 'PI'),
  // 0x30s - string operators
  pcode(0x30, 0, 'CTOS'),
  pcode(0x31, 0, 'ITOS'),
  pcode(0x32, 0, 'HEXS'),
  pcode(0x33, 0, 'SVAL'),
  pcode(0x34, 0, 'QTOS'),
  pcode(0x35, 0, 'QVAL'),
  pcode(0x36, 0, 'SCAT'),
  pcode(0x37, 0, 'SLEN'),
  pcode(0x38, 0, 'CASE'),
  pcode(0x39, 0, 'COPY'),
  pcode(0x3A, 0, 'DELS'),
  pcode(0x3B, 0, 'INSS'),
  pcode(0x3C, 0, 'POSS'),
  pcode(0x3D, 0, 'REPL'),
  undefined, // 0x3E
  undefined, // 0x3F
  // 0x40s - comparison operators
  pcode(0x40, 0, 'EQAL'),
  pcode(0x41, 0, 'NOEQ'),
  pcode(0x42, 0, 'LESS'),
  pcode(0x43, 0, 'MORE'),
  pcode(0x44, 0, 'LSEQ'),
  pcode(0x45, 0, 'MREQ'),
  pcode(0x46, 0, 'MAXI'),
  pcode(0x47, 0, 'MINI'),
  pcode(0x48, 0, 'SEQL'),
  pcode(0x49, 0, 'SNEQ'),
  pcode(0x4A, 0, 'SLES'),
  pcode(0x4B, 0, 'SMOR'),
  pcode(0x4C, 0, 'SLEQ'),
  pcode(0x4D, 0, 'SMEQ'),
  pcode(0x4E, 0, 'SMAX'),
  pcode(0x4F, 0, 'SMIN'),
  // 0x50s - loading stack
  pcode(0x50, 1, 'LDIN'),
  pcode(0x51, 1, 'LDVG'),
  pcode(0x52, 2, 'LDVV'),
  pcode(0x53, 2, 'LDVR'),
  pcode(0x54, 1, 'LDAG'),
  pcode(0x55, 2, 'LDAV'),
  undefined, // 0x56
  pcode(0x57, -1, 'LSTR'),
  pcode(0x58, 0, 'LDMT'),
  undefined, // 0x59
  undefined, // 0x5A
  undefined, // 0x5B
  undefined, // 0x5C
  undefined, // 0x5D
  undefined, // 0x5E
  undefined, // 0x5F
  // 0x60s - storing from stack
  pcode(0x60, 2, 'ZERO'),
  pcode(0x61, 1, 'STVG'),
  pcode(0x62, 2, 'STVV'),
  pcode(0x63, 2, 'STVR'),
  undefined, // 0x64
  undefined, // 0x65
  undefined, // 0x66
  undefined, // 0x67
  pcode(0x68, 0, 'STMT'),
  undefined, // 0x69
  undefined, // 0x6A
  undefined, // 0x6B
  undefined, // 0x6C
  undefined, // 0x6D
  undefined, // 0x6E
  undefined, // 0x6F
  // 0x70s - pointer handling
  pcode(0x70, 0, 'LPTR'),
  pcode(0x71, 0, 'SPTR'),
  pcode(0x72, 0, 'CPTR'),
  pcode(0x73, 0, 'ZPTR'),
  undefined, // 0x74
  undefined, // 0x75
  undefined, // 0x76
  undefined, // 0x77
  pcode(0x78, 0, 'TEST'),
  pcode(0x79, 0, 'CSTR'),
  undefined, // 0x7A
  undefined, // 0x7B
  undefined, // 0x7C
  undefined, // 0x7D
  undefined, // 0x7E
  undefined, // 0x7F
  // 0x80s - flow control
  pcode(0x80, 1, 'JUMP'),
  pcode(0x81, 1, 'IFNO'),
  pcode(0x82, 0, 'HALT'),
  undefined, // 0x83
  undefined, // 0x84
  undefined, // 0x85
  undefined, // 0x86
  undefined, // 0x87
  pcode(0x88, 1, 'SUBR'),
  pcode(0x89, 0, 'RETN'),
  undefined, // 0x8A
  undefined, // 0x8B
  pcode(0x8C, 1, 'PSSR'),
  pcode(0x8D, 0, 'PLSR'),
  pcode(0x8E, 0, 'PSRJ'),
  pcode(0x8F, 0, 'PLRJ'),
  // 0x90s - memory control, dummy commands
  pcode(0x90, 2, 'MEMC'),
  pcode(0x91, 1, 'MEMR'),
  pcode(0x92, 0, 'HFIX'),
  pcode(0x93, 0, 'HCLR'),
  pcode(0x94, 0, 'HRST'),
  undefined, // 0x95
  undefined, // 0x96
  undefined, // 0x97
  pcode(0x98, -2, 'NEWT'), // dummy code
  pcode(0x99, -2, 'OLDT'), // dummy code
  pcode(0x9A, -2, 'RNDC'), // dummy code
  pcode(0x9B, -2, 'TEXL'), // dummy code
  pcode(0x9C, -2, 'UPPC'), // dummy code
  pcode(0x9D, -2, 'LOWC'), // dummy code
  pcode(0x9E, -2, 'LEFS'), // dummy code
  pcode(0x9F, -2, 'RGTS'), // dummy code
  // 0xA0s - runtime flags, text output, debugging, dummy codes
  pcode(0xA0, 0, 'PNUP'),
  pcode(0xA1, 0, 'PNDN'),
  pcode(0xA2, 0, 'UDAT'),
  pcode(0xA3, 0, 'NDAT'),
  pcode(0xA4, 0, 'KECH'),
  undefined, // 0xA5
  pcode(0xA6, 0, 'OUTP'),
  pcode(0xA7, 0, 'CONS'),
  pcode(0xA8, 0, 'TRAC'),
  pcode(0xA9, 0, 'MEMW'),
  pcode(0xAA, 0, 'DUMP'),
  pcode(0xAB, -2, 'SVD0'), // dummy code
  pcode(0xAC, -2, 'BOOL'), // dummy code
  pcode(0xAD, -2, 'ILIN'), // dummy code
  undefined, // 0xAE
  undefined, // 0xAF
  // 0xB0s - timing, input, text output
  pcode(0xB0, 0, 'TIME'),
  pcode(0xB1, 0, 'TSET'),
  pcode(0xB2, 0, 'WAIT'),
  pcode(0xB3, 0, 'TDET'),
  undefined, // 0xB4
  undefined, // 0xB5
  undefined, // 0xB6
  undefined, // 0xB7
  pcode(0xB8, 0, 'INPT'),
  pcode(0xB9, 0, 'ICLR'),
  pcode(0xBA, 0, 'BUFR'),
  pcode(0xBB, 0, 'READ'),
  pcode(0xBC, 0, 'RDLN'),
  pcode(0xBD, 0, 'PRNT'),
  pcode(0xBE, 0, 'TEXT'),
  pcode(0xBF, 0, 'NEWL'),
  // 0xC0s - file handling (not yet implemented)
  pcode(0xC0, 0, 'FDIR'),
  pcode(0xC1, 0, 'OPEN'),
  pcode(0xC2, 0, 'CLOS'),
  pcode(0xC3, 0, 'FPTR'),
  pcode(0xC4, 0, 'FBEG'),
  pcode(0xC5, 0, 'EOF'),
  pcode(0xC6, 0, 'FRDS'),
  pcode(0xC7, 0, 'FRLN'),
  pcode(0xC8, 0, 'FWRS'),
  pcode(0xC9, 0, 'FWNL'),
  undefined, // 0xCA
  undefined, // 0xCB
  undefined, // 0xCC
  undefined, // 0xCD
  undefined, // 0xCE
  undefined, // 0xCF
  // 0xD0s - canvas, turtle settings
  pcode(0xD0, 0, 'CANV'),
  pcode(0xD1, 0, 'RESO'),
  pcode(0xD2, 0, 'PIXC'),
  pcode(0xD3, 0, 'PIXS'),
  pcode(0xD4, 0, 'ANGL'),
  pcode(0xD5, 0, 'CURS'),
  undefined, // 0xD6
  undefined, // 0xD7
  pcode(0xD8, 0, 'HOME'),
  pcode(0xD9, 0, 'SETX'),
  pcode(0xDA, 0, 'SETY'),
  pcode(0xDB, 0, 'SETD'),
  pcode(0xDC, 0, 'THIK'),
  pcode(0xDD, 0, 'COLR'),
  pcode(0xDE, 0, 'RGB'),
  pcode(0xDF, 0, 'MIXC'),
  // 0xE0s - turtle movement
  pcode(0xE0, 0, 'TOXY'),
  pcode(0xE1, 0, 'MVXY'),
  pcode(0xE2, 0, 'DRXY'),
  pcode(0xE3, 0, 'FWRD'),
  pcode(0xE4, 0, 'BACK'),
  pcode(0xE5, 0, 'LEFT'),
  pcode(0xE6, 0, 'RGHT'),
  pcode(0xE7, 0, 'TURN'),
  undefined, // 0xE8
  undefined, // 0xE9
  undefined, // 0xEA
  undefined, // 0xEB
  pcode(0xEC, 0, 'RMBR'),
  pcode(0xED, 0, 'FRGT'),
  undefined, // 0xEE
  undefined, // 0xEF
  // 0xF0s - shapes and fills, maximum integer
  pcode(0xF0, 0, 'POLY'),
  pcode(0xF1, 0, 'PFIL'),
  pcode(0xF2, 0, 'CIRC'),
  pcode(0xF3, 0, 'BLOT'),
  pcode(0xF4, 0, 'ELPS'),
  pcode(0xF5, 0, 'EBLT'),
  pcode(0xF6, 0, 'BOX'),
  undefined, // 0xF7
  pcode(0xF8, 0, 'BLNK'),
  undefined, // 0xF9
  undefined, // 0xFA
  undefined, // 0xFB
  pcode(0xFC, 0, 'RCOL'),
  pcode(0xFD, 0, 'FILL'),
  undefined, // 0xFE
  pcode(0xFF, 0, 'MXIN')
])
