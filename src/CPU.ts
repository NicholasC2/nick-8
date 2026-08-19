export interface InstructionResult {
    halt?: boolean;
    no_program?: boolean;
}

export class CPU {
    public static readonly SCREEN_WIDTH = 160;
    public static readonly SCREEN_HEIGHT = 160;
    public static readonly SCREEN_SIZE = CPU.SCREEN_WIDTH * CPU.SCREEN_HEIGHT;

    public static readonly SCREEN_ADDR = 10_000;

    public RAM: Uint8Array = new Uint8Array(65_536);

    public IP = 0;

    public registers: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

    constructor(
        public program: Uint8Array
    ) {}

    get screen(): Uint8Array {
        return this.RAM.subarray(
            CPU.SCREEN_ADDR,
            CPU.SCREEN_ADDR + CPU.SCREEN_SIZE
        );
    }

    step(): InstructionResult {
        if(!this.program[this.IP]) {
            if(this.IP === 0) {
                return {
                    no_program: true
                }
            }
            this.IP = 0;
        }

        const opcode = this.program[this.IP];

        console.log(opcode)

        switch (opcode) {
            case 0x00: {
                this.IP += 1;
                break;
            }

            case 0x01: {
                return {
                    halt: true
                };
            }

            case 0x10: {
                const register = this.program[this.IP + 1];
                const value = this.program[this.IP + 2];

                this.checkRegister(register);

                this.registers[register] = value;

                this.IP += 3;
                break;
            }

            case 0x11: {
                const to = this.program[this.IP + 1];
                const from = this.program[this.IP + 2];

                this.checkRegister(to);
                this.checkRegister(from);

                this.registers[to] = this.registers[from];

                this.IP += 3;
                break;
            }

            case 0x12: {
                const a = this.program[this.IP + 1];
                const b = this.program[this.IP + 2];

                this.checkRegister(a);
                this.checkRegister(b);

                this.registers[a] =
                    (this.registers[a] + this.registers[b]) & 0xFF;

                this.IP += 3;
                break;
            }

            case 0x13: {
                const a = this.program[this.IP + 1];
                const b = this.program[this.IP + 2];

                this.checkRegister(a);
                this.checkRegister(b);

                this.registers[a] =
                    (this.registers[a] - this.registers[b]) & 0xFF;

                this.IP += 3;
                break;
            }

            case 0x14: {
                const register = this.program[this.IP + 1];

                this.checkRegister(register);

                this.registers[register] =
                    (this.registers[register] + 1) & 0xFF;

                this.IP += 2;
                break;
            }

            case 0x15: {
                const register = this.program[this.IP + 1];

                this.checkRegister(register);

                this.registers[register] =
                    (this.registers[register] - 1) & 0xFF;

                this.IP += 2;
                break;
            }

            case 0x20: {
                const register = this.program[this.IP + 1];
                const address = this.readAddress(this.IP + 2);

                this.checkRegister(register);

                this.registers[register] = this.RAM[address];

                this.IP += 4;
                break;
            }

            case 0x21: {
                const address = this.readAddress(this.IP + 1);
                const register = this.program[this.IP + 3];

                this.checkRegister(register);

                this.RAM[address] = this.registers[register];

                this.IP += 4;
                break;
            }

            case 0x30: {
                const a = this.program[this.IP + 1];
                const b = this.program[this.IP + 2];

                this.checkRegister(a);
                this.checkRegister(b);

                this.registers[a] =
                    this.registers[a] & this.registers[b];

                this.IP += 3;
                break;
            }

            case 0x31: {
                const a = this.program[this.IP + 1];
                const b = this.program[this.IP + 2];

                this.checkRegister(a);
                this.checkRegister(b);

                this.registers[a] =
                    this.registers[a] | this.registers[b];

                this.IP += 3;
                break;
            }

            case 0x32: {
                const a = this.program[this.IP + 1];
                const b = this.program[this.IP + 2];

                this.checkRegister(a);
                this.checkRegister(b);

                this.registers[a] =
                    this.registers[a] ^ this.registers[b];

                this.IP += 3;
                break;
            }

            case 0x33: {
                const register = this.program[this.IP + 1];

                this.checkRegister(register);

                this.registers[register] =
                    (~this.registers[register]) & 0xFF;

                this.IP += 2;
                break;
            }

            default: {
                throw new Error(`Unknown opcode 0x${opcode.toString(16).padStart(2, "0")} at IP 0x${this.IP.toString(16)}`);
            }
        }

        return {};
    }

    private checkRegister(register: number): void {
        if (register < 0 || register >= this.registers.length) {
            throw new Error(`Invalid register: ${register}`);
        }
    }

    private readAddress(offset: number): number {
        const low = this.program[offset];
        const high = this.program[offset + 1];

        return low | (high << 8);
    }
}
