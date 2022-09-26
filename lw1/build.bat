call tsc ./triangle/main.ts
call pkg ./triangle -o ./build/triangle

call tsc ./tests/tests.ts
call pkg ./tests -o ./build/tests

del /f /s /q .\*.js