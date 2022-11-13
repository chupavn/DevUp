import {
    ValidationRenderer,
    RenderInstruction,
    ValidateResult,
} from "aurelia-validation";

export class FormRenderer {
    render(instruction: RenderInstruction) {
        for (const { result, elements } of instruction.unrender) {
            for (const element of elements) {
                this.remove(element, result);
            }
        }

        for (const { result, elements } of instruction.render) {
            for (const element of elements) {
                this.add(element, result);
            }
        }
    }

    add(element: Element, result: ValidateResult) {
        let container =
            element.parentElement.querySelector(".invalid-feedback");

        if (!container) {
            container = document.createElement("div");
            container.classList.add("invalid-feedback");
        }

        if (!result.valid) {
            element.classList.add("is-invalid");

            const message = document.createElement("span");
            message.textContent = result.message;
            message.id = `validation-message-${result.id}`;

            container.appendChild(message);
        }

        if (container.children.length) {
            element.after(container);
        }

        // if (result.valid) {
        //     return;
        // }

        // const formGroup = element.closest(".field-wrapper");
        // if (!formGroup) {
        //     return;
        // }

        // // add the has-error class to the enclosing form-group div
        // formGroup.classList.add("has-error");

        // // add help-block
        // const message = document.createElement("span");
        // message.className = "form-element-validation-message";
        // message.textContent = result.message;
        // message.id = `validation-message-${result.id}`;
        // formGroup.appendChild(message);
    }

    remove(element: Element, result: ValidateResult) {
        element.classList.remove("is-invalid");

        const error = element.parentElement.querySelector(
            `#validation-message-${result.id}`
        );

        if (error) {
            error.remove();
        }

        // if (result.valid) {
        //     return;
        // }

        // const formGroup = element.closest(".field-wrapper");
        // if (!formGroup) {
        //     return;
        // }

        // // remove help-block
        // const message = formGroup.querySelector(
        //     `#validation-message-${result.id}`
        // );
        // if (message) {
        //     formGroup.removeChild(message);

        //     // remove the has-error class from the enclosing form-group div
        //     if (
        //         formGroup.querySelectorAll(".form-element-validation-message")
        //             .length === 0
        //     ) {
        //         formGroup.classList.remove("has-error");
        //     }
        // }
    }
}
