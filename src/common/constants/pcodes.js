/*
An array of machine pcodes.
*/
export default [
  // 0x00s - basic stack operations, boolean operators
  { code: 0x00, args: 0, str: 'NULL' },
  { code: 0x01, args: 0, str: 'DUPL' },
  { code: 0x02, args: 0, str: 'SWAP' },
  { code: 0x03, args: 0, str: 'ROTA' },
  { code: 0x04, args: 0, str: 'INCR' },
  { code: 0x05, args: 0, str: 'DECR' },
  undefined, // 0x06
  undefined, // 0x07
  { code: 0x08, args: 0, str: 'NOT' },
  { code: 0x09, args: 0, str: 'AND' },
  { code: 0x0A, args: 0, str: 'OR' },
  { code: 0x0B, args: 0, str: 'XOR' },
  { code: 0x0C, args: 0, str: 'BAND' },
  { code: 0x0D, args: 0, str: 'BOR' },
  undefined, // 0x0E
  undefined, // 0x0F
  // 0x10s - integer operators
  { code: 0x10, args: 0, str: 'NEG' },
  { code: 0x11, args: 0, str: 'ABS' },
  { code: 0x12, args: 0, str: 'SIGN' },
  { code: 0x13, args: 0, str: 'RAND' },
  { code: 0x14, args: 0, str: 'SEED' },
  undefined, // 0x15
  undefined, // 0x16
  undefined, // 0x17
  { code: 0x18, args: 0, str: 'PLUS' },
  { code: 0x19, args: 0, str: 'SUBT' },
  { code: 0x1A, args: 0, str: 'MULT' },
  { code: 0x1B, args: 0, str: 'DIVR' },
  { code: 0x1C, args: 0, str: 'DIV' },
  { code: 0x1D, args: 0, str: 'MOD' },
  undefined, // 0x1E
  undefined, // 0x1F
  // 0x20s - pseudo-real operators
  { code: 0x20, args: 0, str: 'DIVM' },
  { code: 0x21, args: 0, str: 'SQRT' },
  { code: 0x22, args: 0, str: 'HYP' },
  { code: 0x23, args: 0, str: 'ROOT' },
  { code: 0x24, args: 0, str: 'POWR' },
  { code: 0x25, args: 0, str: 'LOG' },
  { code: 0x26, args: 0, str: 'ALOG' },
  { code: 0x27, args: 0, str: 'LN' },
  { code: 0x28, args: 0, str: 'EXP' },
  { code: 0x29, args: 0, str: 'SIN' },
  { code: 0x2A, args: 0, str: 'COS' },
  { code: 0x2B, args: 0, str: 'TAN' },
  { code: 0x2C, args: 0, str: 'ASIN' },
  { code: 0x2D, args: 0, str: 'ACOS' },
  { code: 0x2E, args: 0, str: 'ATAN' },
  { code: 0x2F, args: 0, str: 'PI' },
  // 0x30s - string operators
  { code: 0x30, args: 0, str: 'CTOS' },
  { code: 0x31, args: 0, str: 'ITOS' },
  { code: 0x32, args: 0, str: 'HEXS' },
  { code: 0x33, args: 0, str: 'SVAL' },
  { code: 0x34, args: 0, str: 'QTOS' },
  { code: 0x35, args: 0, str: 'QVAL' },
  { code: 0x36, args: 0, str: 'SCAT' },
  { code: 0x37, args: 0, str: 'SLEN' },
  { code: 0x38, args: 0, str: 'CASE' },
  { code: 0x39, args: 0, str: 'COPY' },
  { code: 0x3A, args: 0, str: 'DELS' },
  { code: 0x3B, args: 0, str: 'INSS' },
  { code: 0x3C, args: 0, str: 'POSS' },
  { code: 0x3D, args: 0, str: 'REPL' },
  { code: 0x3E, args: 0, str: 'SASC' },
  { code: 0x3F, args: 0, str: 'SPAD' },
  // 0x40s - comparison operators
  { code: 0x40, args: 0, str: 'EQAL' },
  { code: 0x41, args: 0, str: 'NOEQ' },
  { code: 0x42, args: 0, str: 'LESS' },
  { code: 0x43, args: 0, str: 'MORE' },
  { code: 0x44, args: 0, str: 'LSEQ' },
  { code: 0x45, args: 0, str: 'MREQ' },
  { code: 0x46, args: 0, str: 'MAXI' },
  { code: 0x47, args: 0, str: 'MINI' },
  { code: 0x48, args: 0, str: 'SEQL' },
  { code: 0x49, args: 0, str: 'SNEQ' },
  { code: 0x4A, args: 0, str: 'SLES' },
  { code: 0x4B, args: 0, str: 'SMOR' },
  { code: 0x4C, args: 0, str: 'SLEQ' },
  { code: 0x4D, args: 0, str: 'SMEQ' },
  { code: 0x4E, args: 0, str: 'SMAX' },
  { code: 0x4F, args: 0, str: 'SMIN' },
  // 0x50s - loading stack
  { code: 0x50, args: 1, str: 'LDIN' },
  { code: 0x51, args: 1, str: 'LDVG' },
  { code: 0x52, args: 2, str: 'LDVV' },
  { code: 0x53, args: 2, str: 'LDVR' },
  { code: 0x54, args: 1, str: 'LDAG' },
  { code: 0x55, args: 2, str: 'LDAV' },
  undefined, // 0x56
  { code: 0x57, args: -1, str: 'LSTR' },
  { code: 0x58, args: 0, str: 'LDMT' },
  undefined, // 0x59
  undefined, // 0x5A
  undefined, // 0x5B
  { code: 0x5C, args: 0, str: 'PEEK' },
  { code: 0x5D, args: 0, str: 'POKE' },
  undefined, // 0x5E
  undefined, // 0x5F
  // 0x60s - storing from stack
  { code: 0x60, args: 2, str: 'ZERO' },
  { code: 0x61, args: 1, str: 'STVG' },
  { code: 0x62, args: 2, str: 'STVV' },
  { code: 0x63, args: 2, str: 'STVR' },
  undefined, // 0x64
  undefined, // 0x65
  undefined, // 0x66
  undefined, // 0x67
  { code: 0x68, args: 0, str: 'STMT' },
  undefined, // 0x69
  undefined, // 0x6A
  undefined, // 0x6B
  undefined, // 0x6C
  undefined, // 0x6D
  undefined, // 0x6E
  undefined, // 0x6F
  // 0x70s - pointer handling
  { code: 0x70, args: 0, str: 'LPTR' },
  { code: 0x71, args: 0, str: 'SPTR' },
  { code: 0x72, args: 0, str: 'CPTR' },
  { code: 0x73, args: 0, str: 'ZPTR' },
  undefined, // 0x74
  undefined, // 0x75
  undefined, // 0x76
  undefined, // 0x77
  { code: 0x78, args: 0, str: 'TEST' },
  { code: 0x79, args: 0, str: 'CSTR' },
  undefined, // 0x7A
  undefined, // 0x7B
  undefined, // 0x7C
  undefined, // 0x7D
  undefined, // 0x7E
  undefined, // 0x7F
  // 0x80s - flow control
  { code: 0x80, args: 1, str: 'JUMP' },
  { code: 0x81, args: 1, str: 'IFNO' },
  { code: 0x82, args: 0, str: 'HALT' },
  undefined, // 0x83
  undefined, // 0x84
  undefined, // 0x85
  undefined, // 0x86
  undefined, // 0x87
  { code: 0x88, args: 1, str: 'SUBR' },
  { code: 0x89, args: 0, str: 'RETN' },
  undefined, // 0x8A
  undefined, // 0x8B
  { code: 0x8C, args: 1, str: 'PSSR' },
  { code: 0x8D, args: 0, str: 'PLSR' },
  { code: 0x8E, args: 0, str: 'PSRJ' },
  { code: 0x8F, args: 0, str: 'PLRJ' },
  // 0x90s - memory control, dummy commands
  { code: 0x90, args: 2, str: 'MEMC' },
  { code: 0x91, args: 1, str: 'MEMR' },
  { code: 0x92, args: 0, str: 'HFIX' },
  { code: 0x93, args: 0, str: 'HCLR' },
  { code: 0x94, args: 0, str: 'HRST' },
  undefined, // 0x95
  undefined, // 0x96
  undefined, // 0x97
  { code: 0x98, args: -2, str: 'NEWT' }, // dummy code
  { code: 0x99, args: -2, str: 'OLDT' }, // dummy code
  { code: 0x9A, args: -2, str: 'RNDC' }, // dummy code
  { code: 0x9B, args: -2, str: 'TEXL' }, // dummy code
  { code: 0x9C, args: -2, str: 'UPPC' }, // dummy code
  { code: 0x9D, args: -2, str: 'LOWC' }, // dummy code
  { code: 0x9E, args: -2, str: 'LEFS' }, // dummy code
  { code: 0x9F, args: -2, str: 'RGTS' }, // dummy code
  // 0xA0s - runtime flags, text output, debugging, dummy codes
  { code: 0xA0, args: 0, str: 'PNUP' },
  { code: 0xA1, args: 0, str: 'PNDN' },
  { code: 0xA2, args: 0, str: 'UDAT' },
  { code: 0xA3, args: 0, str: 'NDAT' },
  { code: 0xA4, args: 0, str: 'KECH' },
  undefined, // 0xA5
  { code: 0xA6, args: 0, str: 'OUTP' },
  { code: 0xA7, args: 0, str: 'CONS' },
  { code: 0xA8, args: 0, str: 'TRAC' },
  { code: 0xA9, args: 0, str: 'MEMW' },
  { code: 0xAA, args: 0, str: 'DUMP' },
  { code: 0xAB, args: -2, str: 'SVD0' }, // dummy code
  { code: 0xAC, args: -2, str: 'BOOL' }, // dummy code
  { code: 0xAD, args: -2, str: 'ILIN' }, // dummy code
  undefined, // 0xAE
  undefined, // 0xAF
  // 0xB0s - timing, input, text output
  { code: 0xB0, args: 0, str: 'TIME' },
  { code: 0xB1, args: 0, str: 'TSET' },
  { code: 0xB2, args: 0, str: 'WAIT' },
  { code: 0xB3, args: 0, str: 'TDET' },
  undefined, // 0xB4
  undefined, // 0xB5
  undefined, // 0xB6
  undefined, // 0xB7
  { code: 0xB8, args: 0, str: 'INPT' },
  { code: 0xB9, args: 0, str: 'ICLR' },
  { code: 0xBA, args: 0, str: 'BUFR' },
  { code: 0xBB, args: 0, str: 'READ' },
  { code: 0xBC, args: 0, str: 'RDLN' },
  { code: 0xBD, args: 0, str: 'PRNT' },
  { code: 0xBE, args: 0, str: 'TEXT' },
  { code: 0xBF, args: 0, str: 'NEWL' },
  // 0xC0s - file handling (not yet implemented)
  { code: 0xC0, args: 0, str: 'FDIR' },
  { code: 0xC1, args: 0, str: 'OPEN' },
  { code: 0xC2, args: 0, str: 'CLOS' },
  { code: 0xC3, args: 0, str: 'FPTR' },
  { code: 0xC4, args: 0, str: 'FBEG' },
  { code: 0xC5, args: 0, str: 'EOF' },
  { code: 0xC6, args: 0, str: 'FRDS' },
  { code: 0xC7, args: 0, str: 'FRLN' },
  { code: 0xC8, args: 0, str: 'FWRS' },
  { code: 0xC9, args: 0, str: 'FWNL' },
  undefined, // 0xCA
  undefined, // 0xCB
  undefined, // 0xCC
  undefined, // 0xCD
  undefined, // 0xCE
  undefined, // 0xCF
  // 0xD0s - canvas, turtle settings
  { code: 0xD0, args: 0, str: 'CANV' },
  { code: 0xD1, args: 0, str: 'RESO' },
  { code: 0xD2, args: 0, str: 'PIXC' },
  { code: 0xD3, args: 0, str: 'PIXS' },
  { code: 0xD4, args: 0, str: 'ANGL' },
  { code: 0xD5, args: 0, str: 'CURS' },
  undefined, // 0xD6
  undefined, // 0xD7
  { code: 0xD8, args: 0, str: 'HOME' },
  { code: 0xD9, args: 0, str: 'SETX' },
  { code: 0xDA, args: 0, str: 'SETY' },
  { code: 0xDB, args: 0, str: 'SETD' },
  { code: 0xDC, args: 0, str: 'THIK' },
  { code: 0xDD, args: 0, str: 'COLR' },
  { code: 0xDE, args: 0, str: 'RGB' },
  { code: 0xDF, args: 0, str: 'MIXC' },
  // 0xE0s - turtle movement
  { code: 0xE0, args: 0, str: 'TOXY' },
  { code: 0xE1, args: 0, str: 'MVXY' },
  { code: 0xE2, args: 0, str: 'DRXY' },
  { code: 0xE3, args: 0, str: 'FWRD' },
  { code: 0xE4, args: 0, str: 'BACK' },
  { code: 0xE5, args: 0, str: 'LEFT' },
  { code: 0xE6, args: 0, str: 'RGHT' },
  { code: 0xE7, args: 0, str: 'TURN' },
  undefined, // 0xE8
  undefined, // 0xE9
  undefined, // 0xEA
  undefined, // 0xEB
  { code: 0xEC, args: 0, str: 'RMBR' },
  { code: 0xED, args: 0, str: 'FRGT' },
  undefined, // 0xEE
  undefined, // 0xEF
  // 0xF0s - shapes and fills, maximum integer
  { code: 0xF0, args: 0, str: 'POLY' },
  { code: 0xF1, args: 0, str: 'PFIL' },
  { code: 0xF2, args: 0, str: 'CIRC' },
  { code: 0xF3, args: 0, str: 'BLOT' },
  { code: 0xF4, args: 0, str: 'ELPS' },
  { code: 0xF5, args: 0, str: 'EBLT' },
  { code: 0xF6, args: 0, str: 'BOX' },
  undefined, // 0xF7
  { code: 0xF8, args: 0, str: 'BLNK' },
  undefined, // 0xF9
  undefined, // 0xFA
  undefined, // 0xFB
  { code: 0xFC, args: 0, str: 'RCOL' },
  { code: 0xFD, args: 0, str: 'FILL' },
  undefined, // 0xFE
  { code: 0xFF, args: 0, str: 'MXIN' }
]
