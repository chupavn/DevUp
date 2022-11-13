import { DialogService } from "aurelia-dialog";
import {
  autoinject,
  bindable,
  TaskQueue,
  computedFrom,
} from "aurelia-framework";
import { ArticleService } from "services/article-service";
import { AuthService } from "services/auth-service";
// import * as SimpleMDE from "simplemde";
import { RouterConfiguration, Router } from "aurelia-router";
import { TagService } from "services/tag-service";
import * as hljs from "highlight.js";
import * as fluidvids from "fluidvids.js";
import * as toastr from "toastr";
import { UploadService } from "services/upload-service";
declare const SimpleMDE;

@autoinject
export class ArticleNew {
  private articleId: any;
  private simpleMDE: any;
  private mdEditorEl: HTMLElement;
  private titleEl: HTMLTextAreaElement;
  private article: any;
  private articleClone: any;
  private allTags: any[];
  private allTagNames: any[];
  private editorState: "editor" | "preview" = "editor";

  private coverFileEl: HTMLInputElement;
  private coverFiles: FileList;
  private uploadingCover = false;

  private tags: any[] = [{ name: "javascript" }, { name: "webdev" }];

  constructor(
    private articleService: ArticleService,
    private tagService: TagService,
    private uploadService: UploadService,
    private router: Router,
    private taskQueue: TaskQueue
  ) {}

  cloneArticle() {
    this.articleClone = JSON.parse(JSON.stringify(this.article));
  }

  async activate(params, routeConfig, navigationInstruction) {
    this.articleId = params.id;
    if (this.articleId && this.articleId !== "new") {
      this.article = await this.articleService.get(`/${this.articleId}`);
    } else {
      this.article = {
        title: "",
        content: "",
        tags: [],
      };
    }

    this.cloneArticle();
  }

  attached() {
    this.tagService.getAll("").then((res) => {
      this.allTags = res;
      this.allTagNames = this.allTags.map((x) => {
        return {
          name: x.name,
          value: x.name,
          backGroundColorHex: x.backGroundColorHex,
          textColorHex: x.textColorHex,
        };
      });
    });

    this.simpleMDE = new SimpleMDE({
      element: this.mdEditorEl,
      placeholder: "Write your post content here...",
      renderingConfig: {
        singleLineBreaks: true,
        codeSyntaxHighlighting: true,
      },
      showIcons: [
        "bold",
        "italic",
        "strikethrough",
        "heading",
        "heading-smaller",
        "heading-bigger",
        "code",
        "quote",
        "unordered-list",
        "ordered-list",
        "clean-block",
        "link",
        "image",
        "table",
        "horizontal-rule",
        "fullscreen",
        "guide",
      ],
      hideIcons: ["preview", "side-by-side"],
    });

    this.simpleMDE.codemirror.setOption("scrollbarStyle", null);
    this.simpleMDE.value(this.article.content);

    this.titleEl.addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });

    //resize title textarea
    resize(this.titleEl);

    this.titleEl.addEventListener("keydown", autosize);
    function autosize() {
      resize(this);
    }

    function resize(el) {
      setTimeout(function () {
        el.style.cssText = "height:auto; padding:0";
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = "height:" + el.scrollHeight + "px";
      }, 0);
    }
  }

  validate() {
    const content = this.simpleMDE.value();
    return (
      content &&
      content.length > 0 &&
      this.article.title &&
      this.article.title.length > 0 &&
      (!this.article.tags || this.article.tags.length <= 4)
    );
  }

  async createAndPublished() {
    if (!this.validate()) {
      alert("Invalid");
      return;
    }

    try {
      this.article.content = this.simpleMDE.value();
      const article = await this.articleService.post("", this.article);
      this.article = article;
      this.articleId = article.id;
      const publishedArticle = await this.articleService.published(article.id);
      this.article = publishedArticle;
      this.router.navigateToRoute(
        "edit-article",
        { id: article.id },
        { replace: true }
      );
      this.cloneArticle();
      toastr.success("Saved");
    } catch (error) {
      console.log(error);
    }
  }

  async create() {
    if (!this.validate()) {
      alert("Invalid");
      return;
    }

    try {
      this.article.content = this.simpleMDE.value();
      const article = await this.articleService.post("", this.article);
      this.article = article;
      this.articleId = article.id;
      this.router.navigateToRoute(
        "edit-article",
        { id: article.id },
        { replace: true }
      );
      toastr.success("Saved");
      this.cloneArticle();
    } catch (error) {
      console.log(error);
    }
  }

  async saveAndPublished() {
    if (!this.validate()) {
      alert("Invalid");
      return;
    }

    try {
      this.article.content = this.simpleMDE.value();
      const article = await this.articleService.put(
        "/" + this.article.id,
        this.article
      );
      this.article = article;
      this.articleId = article.id;

      const publishedArticle = await this.articleService.published(article.id);
      this.article = publishedArticle;
      this.highlightCode();
      toastr.success("Saved");
      this.cloneArticle();
    } catch (error) {
      console.log(error);
    }
  }

  async saveAndUnPublish() {
    if (!this.validate()) {
      alert("Invalid");
      return;
    }

    try {
      this.article.content = this.simpleMDE.value();
      const article = await this.articleService.put(
        "/" + this.article.id,
        this.article
      );
      this.article = article;
      this.articleId = article.id;

      const unpublishedArticle = await this.articleService.unpublished(
        article.id
      );
      this.article = unpublishedArticle;
      this.highlightCode();
      toastr.success("Saved");
      this.cloneArticle();
    } catch (error) {
      console.log(error);
    }
  }

  async save() {
    if (!this.validate()) {
      alert("Invalid");
      return;
    }

    try {
      this.article.content = this.simpleMDE.value();
      const article = await this.articleService.put(
        "/" + this.article.id,
        this.article
      );
      this.article = article;
      this.articleId = article.id;
      this.highlightCode();
      toastr.success("Saved");
      this.cloneArticle();
    } catch (error) {
      console.log(error);
    }
  }

  revertChanged() {
    this.article = JSON.parse(JSON.stringify(this.articleClone));
  }

  cancel() {
    this.router.navigateToRoute("home");
  }

  activeEditor() {
    this.editorState = "editor";
  }

  preview() {
    this.article.content = this.simpleMDE.value();
    // this.article.contentHtml = this.simpleMDE.options.previewRender(this.article.content);
    this.editorState = "preview";

    this.highlightCode();
  }

  highlightCode() {
    setTimeout(() => {
      this.taskQueue.queueTask(() => {
        hljs.highlightAll();
        fluidvids.render();
      });
    });
  }

  titleChanged() {
    // Dealing with Textarea Height
    function calcHeight(value) {
      let numberOfLineBreaks = (value.match(/\n/g) || []).length;
      // min-height + lines x line-height + padding + border
      let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
      return newHeight;
    }

    let textarea = this.titleEl;
    textarea.addEventListener("keyup", () => {
      textarea.style.height = calcHeight(textarea.value) + "px";
    });
  }

  showPickFileForm() {
    this.coverFileEl.click();
  }

  async uploadCoverImg() {
    try {
      if (this.coverFiles && this.coverFiles.length === 1) {
        this.uploadingCover = true;
        const uploadResult = await this.uploadService.UploadFile(
          this.coverFiles[0]
        );
        this.article.coverImageUrl = uploadResult.content.url;
        this.coverFiles = null;
        this.uploadingCover = false;
      }
    } catch (error) {
      console.log(error);
      this.uploadingCover = false;
    }
  }

  removeCoverImg() {
    this.article.coverImageUrl = null;
  }

  changeCoverImg() {
    this.showPickFileForm();
  }

  @computedFrom("articleId")
  get isNew(): boolean {
    return !this.articleId || this.articleId === "new";
  }

  @computedFrom("article.isPublished")
  get isPublished(): boolean {
    return !!this.article.isPublished;
  }
}
