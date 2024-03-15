"use client";

import React from "react";
import { UserButton, Protect, useAuth, useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dropdown, MenuProps } from "antd";

export default function Navbar() {
  const pathname = usePathname();
  const { has } = useAuth();
  const { organization }: any = useOrganization();

  const canManage = has && has({ permission: "org:feature:protected" });

  const isActive = (path: string) => {
    return pathname === path;
  };

  const onClick: MenuProps["onClick"] = ({ key }: any) => {};

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
  ].filter(Boolean);

  const pipelinePaths = [
    "/pipeline",
    "/pipeline/[pipelineId]",
    "/pipeline/[pipelineId]/edit",
    "/pipeline/create",
  ];
  const explorePaths = ["/chat", "/chat/[chatId]"];
  const setupPaths = ["/destination", "/user-profile", "/organization-profile"];

  const isActiveExplore = explorePaths?.some((path) => isActive(path));
  const isActivePipeline = pipelinePaths?.some((path) => isActive(path));
  const isActiveSetup = setupPaths?.some((path) => isActive(path));

  return (
    <div className="navbar-container">
      <div className="flex flex-1 items-center justify-end md:justify-between">
        <nav aria-label="Global" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            <li className="flex-list">
              <span>Fabriq</span>
            </li>
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
            {organization && organization?.publicMetadata?.is_connection && (
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
            )}
            {organization && organization?.publicMetadata?.is_explore && (
              <li>
                <Link href="/chat">
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
