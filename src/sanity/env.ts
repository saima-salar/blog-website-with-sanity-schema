class MissingEnvVariableError extends Error {
  variableName: string;

  constructor(variableName: string) {
    super(`Missing or invalid environment variable: ${variableName}`);
    this.name = 'MissingEnvVariableError';
    this.variableName = variableName;

    // Correct the prototype chain
    Object.setPrototypeOf(this, MissingEnvVariableError.prototype);
  }
}
