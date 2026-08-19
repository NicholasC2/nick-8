#ruledef {
    load r{r: u8}, {v: u8} => 0x10 @ r @ v
    mov r{a: u8}, r{b: u8} => 0x11 @ a @ b
    add r{a: u8}, r{b: u8} => 0x12 @ a @ b
    sub r{a: u8}, r{b: u8} => 0x13 @ a @ b
    inc r{r: u8} => 0x14 @ r
    dec r{r: u8} => 0x15 @ r
    read r{r: u8}, {a: u16} => 0x20 @ r @ a
    write {a: u16}, r{r: u8} => 0x21 @ a @ r
    and r{a: u8}, r{b: u8} => 0x30 @ a @ b
    or r{a: u8}, r{b: u8} => 0x31 @ a @ b
    xor r{a: u8}, r{b: u8} => 0x32 @ a @ b
    not r{r: u8} => 0x33 @ r
}