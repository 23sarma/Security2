export class QubitKernel {
  private state: Float64Array;
  private numQubits: number;

  constructor(numQubits: number) {
    this.numQubits = numQubits;
    this.state = new Float64Array(2 ** (numQubits + 1));
    this.state[0] = 1.0; // Initialize |0...0>
  }

  public applyHadamard(target: number): void {
    const invSqrt2 = 1 / Math.sqrt(2);
    for (let i = 0; i < (1 << this.numQubits); i++) {
      if (!(i & (1 << target))) {
        const bit = 1 << target;
        const a = i * 2;
        const b = (i | bit) * 2;
        const re0 = this.state[a], im0 = this.state[a + 1];
        const re1 = this.state[b], im1 = this.state[b + 1];
        
        this.state[a] = (re0 + re1) * invSqrt2;
        this.state[a + 1] = (im0 + im1) * invSqrt2;
        this.state[b] = (re0 - re1) * invSqrt2;
        this.state[b + 1] = (im0 - im1) * invSqrt2;
      }
    }
  }

  public measure(): number {
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < (1 << this.numQubits); i++) {
      cumulative += Math.pow(this.state[i * 2], 2) + Math.pow(this.state[i * 2 + 1], 2);
      if (rand <= cumulative) return i;
    }
    return 0;
  }

  public getStateVector(): Float64Array {
    return this.state;
  }
}