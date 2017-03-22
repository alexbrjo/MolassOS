Instructions Tests
==================
All the instructions tests check values of registers and flags after each 
operation. Multiple paths through each operation are checked.

Addition Operations
-------------------
A = A + A, B, C, D, E, H, L, M or immed
- Check all flags
- Check value of Accumulation and read registers

Subtraction Operations
-------------------
A = A - A, B, C, D, E, H, L, M or immed
- Check all flags
- Check value of Accumulation and read registers

Multiplication Operations
-------------------------
A = A * A, B, C, D, E, H, L, M or immed
- Check all flags
- Check value of Accumulation and read registers
- Pay special attention to carry

Division Operations
-------------------------
A = A / A, B, C, D, E, H, L, M or immed
- Check all flags
- Check value of Accumulation and read registers
- Pay special attention to carry