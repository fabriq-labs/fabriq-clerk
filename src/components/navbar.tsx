"use client";

import React from "react";
import { UserButton, Protect, useAuth, useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dropdown, MenuProps, Space, Typography } from "antd";

export default function Navbar() {
  const pathname = usePathname();
  const { has } = useAuth();
  const { organization }: any = useOrganization();

  const canManage = has && has({ permission: "org:feature:protected" });

  const isActive = (path: string) => {
    const basePath = path.split("/")[1];
    const currentBasePath = pathname.split("/")[1];

    return currentBasePath === basePath;
  };

  const onClick: MenuProps["onClick"] = ({ key }: any) => {};
  const sitesValue: any = localStorage.getItem("sites")
    ? localStorage.getItem("sites")
    : "";

  const sitesJson = sitesValue && JSON.parse(sitesValue);
  const siteItems =
    sitesJson &&
    sitesJson?.map((item: any) => {
      return {
        key: item.site_id,
        label: item.site_id,
      };
    });

  const site_details = localStorage.getItem("site_details");
  let activeSite;
  if (site_details) {
    const parsed = JSON.parse(site_details);
    activeSite = parsed?.site_id;
  }

  const onselect = (e: any) => {
    const site = sitesJson?.filter((obj: any) => obj.site_id === e.key);
    localStorage.setItem("site_details", JSON.stringify(site[0]));
  };

  const items: any = [
    {
      key: "1",
      label: (
        <Link href={"/user-profile"}>
          <span className={`menu-item`}>User Profile</span>
        </Link>
      ),
    },
    canManage && {
      key: "2",
      label: (
        <Protect permission="org:feature:protected">
          <Link href="/organization-profile">
            <span className={`menu-item`}>Organization Profile</span>
          </Link>
        </Protect>
      ),
    },
    {
      key: "3",
      label: (
        <Link href={"/destination"}>
          <span className={`menu-item`}>Destination</span>
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <Protect permission="org:media:all">
          <Dropdown
            className={`menu-item`}
            menu={{
              items: siteItems,
              selectable: true,
              defaultSelectedKeys: [activeSite],
              onClick: onselect,
            }}
          >
            <Typography.Link>
              <Space>Sites</Space>
            </Typography.Link>
          </Dropdown>
        </Protect>
      ),
    },
  ].filter(Boolean);

  const pipelinePaths = [
    "/pipeline",
    "/pipeline/[pipelineId]",
    "/pipeline/[pipelineId]/edit",
    "/pipeline/create",
  ];
  const explorePaths = ["/explore/[chatId]", "/explore"];
  const articlesPaths = ["/article/[articleId]", "/article"];
  const authorsPath = ["/author/[authorId]", "/author"];
  const chatPaths = ["/chat"];
  const setupPaths = ["/destination", "/user-profile", "/organization-profile"];

  const isActiveExplore = explorePaths?.some((path) => isActive(path));
  const isActiveChat = chatPaths?.some((path) => isActive(path));
  const isActivePipeline = pipelinePaths?.some((path) => isActive(path));
  const isActiveSetup = setupPaths?.some((path) => isActive(path));
  const isArticlePath = articlesPaths?.some((path) => isActive(path));
  const isActiveAuthor = authorsPath?.some((path) => isActive(path));

  return (
    <div className="navbar-container">
      <div className="flex flex-1 items-center justify-end md:justify-between">
        <nav aria-label="Global" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            <li className="flex-list">
              <span>Fabriq</span>
            </li>
            <Protect permission="org:demo:all">
              <li>
                <Link href="/">
                  <span
                    className={`${
                      isActive("/") ? "tab active" : "tab"
                    } transition`}
                  >
                    Home
                  </span>
                </Link>
              </li>
            </Protect>
            <Protect permission="org:media:all">
              <li>
                <Link href="/">
                  <span
                    className={`tab ${
                      isActive("/") ? "active" : ""
                    } transition`}
                  >
                    Overview
                  </span>
                </Link>
              </li>
            </Protect>
            <Protect permission="org:media:all">
              <li>
                <Link href="/article">
                  <span
                    className={`tab ${
                      isArticlePath ? "active" : ""
                    } transition`}
                  >
                    Article
                  </span>
                </Link>
              </li>
            </Protect>
            <Protect permission="org:media:all">
              <li>
                <Link href="/author">
                  <span
                    className={`tab ${
                      isActiveAuthor ? "active" : ""
                    } transition`}
                  >
                    Author
                  </span>
                </Link>
              </li>
            </Protect>
            <Protect permission="org:media:all">
              <li>
                <Link href="/audience">
                  <span
                    className={`tab ${
                      isActive("/audience") ? "active" : ""
                    } transition`}
                  >
                    Audience
                  </span>
                </Link>
              </li>
            </Protect>
            <Protect permission="org:media:all">
              <li>
                <Link href="/revenue">
                  <span
                    className={`tab ${
                      isActive("/revenue") ? "active" : ""
                    } transition`}
                  >
                    Revenue
                  </span>
                </Link>
              </li>
            </Protect>
            <Protect permission="org:feature:protected">
              <li>
                <Link href="/pipeline">
                  <span
                    className={`tab ${
                      isActivePipeline ? "active" : ""
                    } transition`}
                  >
                    Connection
                  </span>
                </Link>
              </li>
            </Protect>
            {organization && organization?.publicMetadata?.is_explore && (
              <li>
                <Link href="/explore">
                  <span
                    className={`tab ${
                      isActiveExplore ? "active" : ""
                    } transition`}
                  >
                    Explore
                  </span>
                </Link>
              </li>
            )}
            {organization && organization?.publicMetadata?.is_explore && (
              <li>
                <Link href="/chat">
                  <span
                    className={`tab ${isActiveChat ? "active" : ""} transition`}
                  >
                    Chat
                  </span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <Dropdown menu={{ items, onClick }}>
            <span className={`tab ${isActiveSetup ? "active" : ""} transition`}>
              Setup
            </span>
          </Dropdown>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
