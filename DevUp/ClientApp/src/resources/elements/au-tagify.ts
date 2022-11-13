import {
  inject,
  bindable,
  bindingMode,
  DOM,
  customElement,
} from "aurelia-framework";
import Tagify from "@yaireo/tagify";

@customElement("au-tagify")
@inject(DOM.Element)
export class AuTagify {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) value: any;
  @bindable maxTags: number = 4;
  @bindable placeholder: string = "";
  @bindable dropdownMaxItems: number = 20;
  @bindable whitelist: any[];
  @bindable tagTextProp: string = "value";

  private tagify: any;
  private inputEl: HTMLInputElement;

  constructor(private element) {
    this.element = element;
  }

  whitelistChanged(): void {
    if (this.tagify) {
      this.setupTags();
    }
  }

  attached(): void {
    if (!this.tagify) {
      this.setupTags();
    }
  }

  afterAttached() {
    console.log("au-tagify: afterAttached");
  }

  setupTags(): void {
    if (this.tagify) {
      this.tagify.destroy();
      this.tagify = null;
    }

    let self = this;

    this.tagify = new (Tagify as any)(this.inputEl, {
      tagTextProp: this.tagTextProp,
      whitelist: this.whitelist ?? [],
      skipInvalid: true,
      enforceWhitelist: false,
      maxTags: this.maxTags,
      placeholder: this.placeholder,
      transformTag: (tagData) => {
        let originalTag = self.whitelist.find((x) => x.name === tagData.name);
        tagData.style = "";
        if (originalTag?.backGroundColorHex) {
          tagData.style = `--tag-bg:${originalTag.backGroundColorHex};`;
        }

        if (originalTag?.textColorHex) {
          tagData.style += `--tag-text-color:${originalTag.textColorHex};`;
        }
      },
      dropdown: {
        maxItems: 20, // <- mixumum allowed rendered suggestions
        classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
        enabled: 0, // <- show suggestions on focus
        closeOnSelect: false, // <- do not hide the suggestions dropdown once an item has been selected
      },
      templates: {
        // tag: tagTemplate,
        dropdownItem: function (tagData) {
          let background = tagData.backGroundColorHex
            ? `background:${tagData.backGroundColorHex};`
            : "";
          let color = tagData.textColorHex
            ? `color:${tagData.textColorHex};`
            : "";
          return `
                        <div ${this.getAttributes(tagData)}
                            class='tagify__dropdown__item ${
                              tagData.class ? tagData.class : ""
                            }'
                            style='${background}${color}'
                            tabindex="0"
                            role="option">
                            ${tagData.name}
                        </div>
                    `;
        },
      },
    });

    const valueIds: any[] = this.value.map((x) => x.name);
    const tagsToAdd =
      this.tagify?.settings?.whitelist?.filter((x) =>
        valueIds.includes(x.name)
      ) ?? [];
    this.tagify.addTags(tagsToAdd);
    this.tagify.on("change", (e) => {
      this.value = e.detail.value ? JSON.parse(e.detail.value) : e.detail.value;

      const event = new CustomEvent("value-changed", {
        detail: this.value,
        bubbles: true,
      });

      setTimeout(() => {
        this.element.dispatchEvent(event);
      });
    });
  }
}
