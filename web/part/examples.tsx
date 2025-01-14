const helloWorld =
  `def
  {"dlroW olleH"}yas
od {}eraweb fed`;

const fib =
  `def
  {}yas >| {}gnirts_ot_regetni >|{}bif >| 22
od {}eraweb fed

def
  if
    {1 - n}bif + {2 - n}bif
  esle
    n
  neht 2 < n fi
od {n}bif fed`;

const tutorial =
  `def
  "The \`maercs\` function panics programs when illegal conditions happen"
  ;{"oob"}maercs

  ;"Print with yas function"
  ;{"!!!eraweB"}yas

  ;"Semi-colon is required in-between each statement"

  ;"Addition, subtraction, multiplication, division, and conversion to string for integers"
  ;{0}tuo >| {}gnirts_ot_regetni >| 2 \\ (6 * 5) - 1 + 3
  ;"Integers are written backwards, statement evaluation is also bottom to top"
  ;{1}tuo >| {}gnirts_ot_regetni >| 123-
  ;"Left shift, right shift, and negate"
  ;{2}tuo >| {}gnirts_ot_regetni >| (gen 1-) << 10 >> 2

  ;"\`not\`, bitwise \`or\`, and bitwise \`and\` for booleans"
  ;{3}tuo >| {}gnirts_ot_loob >| ton eslaf dna eslaf ro eurt
  ;"Comparison operators are allowed for integers, booleans, and strings"
  ;"Only when the argument types match"
  ;{4}tuo >| {}gnirts_ot_loob >| 1 = 1 dna "a" > "b" dna eslaf => eurt

  ;"Functions can be called directly"
  ;{5 ,{055 ,5}dda}tuo
  ;"Or using a pipe, in that case the argument is passed as the first parameter"
  ;{6}tuo >| {77}dda >| {}di >| 007

  ;"Utility functions for strings"
  ;{7}tuo >| {"tso"}tacnoc >| {2 ,0}ecils >| "taog"
  ;{8}tuo >| {}gnirts_ot_loob >| "tinu" = {Я}epyt

  ;"Variable declaration is a statement, immutable, and shadows"
  ;{9 ,x}tuo
  ;"a" <- x tel 
  ;"b" <- x tel

  ;"\`if\` is declarative and returns the last statement from the branch"
  ;{01 ,y}tuo
  ;if
    "taert"
  esle
    "kcirt"
  neht eurt fi <- y tel

  ;"\`loop\` is declarative and runs forever"
  ;"\`stop\` is a statement and returns a value when breaking the loop"
  ;{11 ,z}tuo
  ;loop
    "detanimret" pots
  pool <- z tel

  ;"Mutable state is possible with the cell type"
  ;{21}tuo >| {}teg >| tum 
  ;{tum}tes >| {"narama"}tacnoc >| {}teg >| tum 
  ;{"tac"}llec <- tum tel
  
  ;"The entry function must be called \`eraweb\`"
od {}eraweb fed

def
 {b + a}gnirts_ot_regetni
 ;"The last statement of a function is returned"
od {b ,a}dda fed

def
  {}yas 
  >| {s}tacnoc 
  >| {" :"}tacnoc 
  >| {{n}gnirts_ot_regetni}tacnoc
  >| " tuptuO"
od {n ,s}tuo fed
`;

const examples = { helloWorld, fib, tutorial };
export default examples;