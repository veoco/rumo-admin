import { useState } from "react";
import { Route, useLocation, useRoute, Router, Link } from "wouter";

import ErrorPage from './common/error_page';

import IntroPage from './users/pages/intro_page';
import LoginPage from './users/pages/login_page';
import UsersPage from './users/pages/users_page';

import CategoriesPage from "./categories/pages/categories_page";
import CategoryPage from "./categories/pages/category_page";

import TagsPage from "./tags/pages/tags_page";
import TagPage from "./tags/pages/tag_page";

import PostsPage from "./posts/pages/posts_page";

import PagesPage from "./pages/pages/pages_page";

import "./app.css"

const ActiveLink = props => {
  const [isActive] = useRoute(props.href);
  return (
    <Link {...props}>
      <a className={isActive ? "font-bold" : ""}>{props.children}</a>
    </Link>
  );
};

export default function App() {
  const [location, setLocation] = useLocation();

  const token = sessionStorage.getItem('access_token');
  const [isLoginPage] = useRoute("/admin/login");

  if (!isLoginPage && !token) {
    setLocation("/admin/login");
  }

  return (
    <>
      <header className={isLoginPage ? "hidden" : "max-w-2xl mx-auto px-2 my-2 border-b border-gray-800"}>
        <nav className="flex justify-between py-2">
          <ActiveLink href="/admin/">首页</ActiveLink>
          <ActiveLink href="/admin/users/">用户</ActiveLink>
          <ActiveLink href="/admin/categories/">分类</ActiveLink>
          <ActiveLink href="/admin/tags/">标签</ActiveLink>
          <ActiveLink href="/admin/posts/">文章</ActiveLink>
          <ActiveLink href="/admin/pages/">页面</ActiveLink>
        </nav>
      </header>
      <main className="max-w-2xl mx-auto px-2 my-2">
        <Router base="/admin">
          <Route path="/" component={IntroPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/users/" component={UsersPage} />
          <Route path="/categories/" component={CategoriesPage} />
          <Route path="/categories/create" component={CategoryPage} />
          <Route path="/categories/:slug/" component={CategoryPage} />
          <Route path="/tags/" component={TagsPage} />
          <Route path="/tags/create" component={TagPage} />
          <Route path="/tags/:slug/" component={TagPage} />
          <Route path="/posts/" component={PostsPage} />
          <Route path="/pages/" component={PagesPage} />
        </Router>
      </main>
    </>
  )
};
