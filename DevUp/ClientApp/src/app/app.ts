import "../styles/styles.scss";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import "tippy.js/animations/perspective.css";
import "tippy.js/themes/light.css";
import { autoinject, TaskQueue, inject, observable } from "aurelia-framework";
import {
  RouterConfiguration,
  Router,
  activationStrategy,
  NavigationInstruction,
  Next,
  Redirect,
} from "aurelia-router";
import { PLATFORM } from "aurelia-pal";
import * as fluidvids from "fluidvids.js";
import "lazysizes";

@autoinject
export class App {
  private router;

  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    // config.options.pushState = true;
    config.addAuthorizeStep(AuthorizeStep);
    config.addPipelineStep("postRender", PostRenderStep);
    config.map([
      {
        route: ["", "home", "top/:topBy"],
        name: "home",
        moduleId: PLATFORM.moduleName("./home/home"),
        title: "DEV Community 😊😘",
      },

      {
        route: ["articles/:id", "articles/:id/#comments"],
        name: "article-details",
        moduleId: PLATFORM.moduleName("./article/article-details"),
        activationStrategy: activationStrategy.replace,
      },
      {
        route: ["t/:tagName", "t/:tagName/top/:topBy"],
        name: "articles-by-tag",
        moduleId: PLATFORM.moduleName("./pages/article-by-tag/articles-by-tag"),
        activationStrategy: activationStrategy.replace,
      },
      {
        route: ["profile/:userId"],
        name: "user-profile",
        moduleId: PLATFORM.moduleName("./pages/profile/profile"),
        activationStrategy: activationStrategy.invokeLifecycle,
      },
      {
        route: ["settings"],
        name: "settings",
        moduleId: PLATFORM.moduleName("./pages/settings/settings"),
        activationStrategy: activationStrategy.invokeLifecycle,
        settings: { auth: true },
        title: "Settings",
      },
      {
        route: ["dashboard"],
        name: "dashboard",
        moduleId: PLATFORM.moduleName("./pages/dashboard/dashboard"),
        activationStrategy: activationStrategy.invokeLifecycle,
        settings: { auth: true },
      },
      //   { route: ['top/:topBy'],   name: 'home', moduleId: PLATFORM.moduleName('./home/home') },
      {
        route: ["tags"],
        name: "tags",
        moduleId: PLATFORM.moduleName("./tags/tag-list"),
        title: "#Tags",
      },
      {
        route: ["reading-list", "reading-list/:archive"],
        name: "reading-list",
        moduleId: PLATFORM.moduleName("./article/reading-list"),
        title: "Reading list",
        settings: { auth: true },
      },
      {
        route: ["search"],
        name: "search",
        moduleId: PLATFORM.moduleName("./pages/search/search"),
        title: "Search Results",
        activationStrategy: activationStrategy.replace,
      },
      {
        route: ["articles/new"],
        name: "new-article",
        moduleId: PLATFORM.moduleName("../app/article/article-edit"),
        activationStrategy: activationStrategy.replace,
        title: "Create new article",
        settings: { auth: true },
      },
      {
        route: ["articles/:id/edit"],
        name: "edit-article",
        moduleId: PLATFORM.moduleName("../app/article/article-edit"),
        activationStrategy: activationStrategy.replace,
        title: "Edit article",
        settings: { auth: true },
      },
      {
        route: ["about"],
        name: "about",
        moduleId: PLATFORM.moduleName("./about/about"),
        title: "About",
      },
      {
        route: ["enter"],
        name: "enter",
        moduleId: PLATFORM.moduleName("./auth/enter"),
        activationStrategy: activationStrategy.replace,
        title: "Enter",
      },
      {
        route: ["users/password/new"],
        name: "forgot-password",
        moduleId: PLATFORM.moduleName("./auth/forgot-password"),
        activationStrategy: activationStrategy.invokeLifecycle,
        title: "Forgot password",
      },
      {
        route: ["users/reset-password/:email/:code"],
        name: "reset-password",
        moduleId: PLATFORM.moduleName("./auth/reset-password"),
        activationStrategy: activationStrategy.invokeLifecycle,
        title: "Reset password",
      },
    ]);

    const handleUnknownRoutes = (instruction) => {
      return {
        route: "notfound",
        moduleId: PLATFORM.moduleName("./not-found"),
      };
    };

    config.mapUnknownRoutes(handleUnknownRoutes);
  }

  afterAttached() {
    fluidvids.init({
      selector: ["iframe", "object"], // runs querySelectorAll()
      players: ["www.youtube.com", "player.vimeo.com"], // players to support
    });
  }

  scrollTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
}

class PostRenderStep {
  run(instruction: NavigationInstruction, next: Next) {
    if (!instruction.config.settings.noScrollToTop) {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }
    return next();
  }
}

import { connectTo, dispatchify, Store } from "aurelia-store";
import { State } from "./store/state";
import { getCurrentUser } from "./store/actions/users";

@inject(Store)
@autoinject
class AuthorizeStep {
  @observable state: State;
  private subscription: any;

  constructor(store) {
    store.state.subscribe((newState) => (this.state = newState));
  }

  async run(navigationInstruction: NavigationInstruction, next: Next) {
    // await dispatchify(getCurrentUser)();
    // return next();
    if (!this.state.hasLoadedParams) {
      await dispatchify(getCurrentUser)();
    }

    if (
      navigationInstruction
        .getAllInstructions()
        .some((i) => i.config.settings.auth)
    ) {
      const isLoggedIn = this.state.auth.loggedIn;
      if (!isLoggedIn) {
        console.log(
          `User NOT authorized to access ${navigationInstruction.fragment}`
        );
        return next.cancel(new Redirect("/"));
      }
    }

    return next();
  }
}
