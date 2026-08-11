# Q-Kernel Simulator

A robust, TypeScript-native quantum circuit engine. 

## Usage
typescript
const q = new QubitState(2);
q.applyGate(HADAMARD, 0);
q.applyGate(CNOT, 0);
console.log(q.measure());
