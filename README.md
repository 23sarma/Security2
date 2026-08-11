# Q-Kernel Simulator

This utility provides a robust environment for simulating quantum gates. 

## Usage
typescript
const sim = new QubitKernel(2);
sim.applyHadamard(0);
const result = sim.measure();
