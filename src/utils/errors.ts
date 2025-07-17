interface FieldErrorOptions {
    fields: string[];
}

export class FieldError extends Error {
    fields: string[];

    constructor(message: string, options: FieldErrorOptions) {
        super(message);
        this.fields = options.fields;
    }
}

export class FieldRequiredError extends FieldError {
    constructor(options: FieldErrorOptions) {
        super("This field is required", options);
    }
}

export class UniqueConstraintError extends FieldError {
    constructor(options: FieldErrorOptions) {
        super("This value is already taken", options);
    }
}
