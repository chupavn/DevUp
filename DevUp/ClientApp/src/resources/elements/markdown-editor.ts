import {
  inject,
  bindable,
  bindingMode,
  DOM,
  customElement,
} from "aurelia-framework";
// import SimpleMDE from "simplemde";

declare const SimpleMDE;

@customElement("markdown-editor")
@inject(DOM.Element)
export class MarkdownEditor {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) content: any;
  @bindable placeholder = "";
  @bindable autofocus = false;

  private simpleMDE: any;
  private inputEl: HTMLTextAreaElement;

  constructor(private element) {
    this.element = element;
  }

  attached(): void {
    if (!this.simpleMDE) {
      this.setupMDE();
    }
  }

  detached() {
    if (this.simpleMDE) {
      this.simpleMDE.toTextArea();
      this.simpleMDE = null;
    }
  }

  afterAttached() {
    console.log("markdown-editor: afterAttached");
  }

  contentChanged() {
    if (this.simpleMDE && this.content !== this.simpleMDE.value()) {
      this.simpleMDE.value(this.content);
      this.simpleMDE.codemirror.focus();
      // Set the cursor at the end of existing content
      this.simpleMDE.codemirror.setCursor(
        this.simpleMDE.codemirror.lineCount(),
        0
      );
    }
  }

  setupMDE(): void {
    if (this.simpleMDE) {
      this.simpleMDE.toTextArea();
      this.simpleMDE = null;
    }

    this.simpleMDE = new SimpleMDE({
      element: this.inputEl,
      placeholder: this.placeholder || "Write something...",
      renderingConfig: {
        singleLineBreaks: true,
        codeSyntaxHighlighting: true,
      },
      initialValue: this.content,
      status: false,
      autofocus: this.autofocus,
      spellChecker: false,
      // toolbar: true,
      // toolbarTips: true,
      showIcons: [
        "bold",
        "italic",
        "strikethrough",
        "code",
        "quote",
        "unordered-list",
        "ordered-list",
        "clean-block",
        "link",
        "image",
        "horizontal-rule",
        "guide",
      ],
      hideIcons: [
        "heading",
        "heading-smaller",
        "heading-bigger",
        "table",
        "fullscreen",
        "preview",
        "side-by-side",
      ],
    });

    this.simpleMDE.value(this.content);

    this.simpleMDE.codemirror.setCursor(
      this.simpleMDE.codemirror.lineCount(),
      0
    );

    this.simpleMDE.codemirror.on("change", () => {
      this.content = this.simpleMDE.value();

      const event = new CustomEvent("value-changed", {
        detail: this.simpleMDE.value(),
        bubbles: true,
      });

      setTimeout(() => {
        this.element.dispatchEvent(event);
      });
    });
  }
}
