import React from "react";
import { UserButton, Protect, useAuth, useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Dropdown, MenuProps } from "antd";
import Logo from "../../public/nigo-app.png";

export default function Navbar() {
  const router = useRouter();
  const { has } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = React.useState<string | null>(
    null
  );
  const { organization }: any = useOrganization();
  const pathname = usePathname();

  const canManage = has && has({ permission: "org:feature:protected" });

  const isActive = (path: string) => {
    return pathname === path;
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    setSelectedMenuItem(key);
  };

  const openInPopup = (url: string) => {
    window.open(url, "_blank", "width=1200,height=800");
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
  ].filter(Boolean);

  return (
    <div className="navbar-container">
      <div className="flex flex-1 items-center justify-end md:justify-between">
        <nav aria-label="Global" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            <li className="flex-list">
              <Image src={Logo} alt="nigo" width={50} height={35} />
            </li>
            <li>
              <Link href="/">
                <span
                  className={`${
                    isActive("/") ? "tab active" : "tab"
                  } transition`}
                >
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link href="/company">
                <span
                  className={`${
                    isActive("/company") ? "tab active" : "tab"
                  } transition`}
                >
                  Company
                </span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span
                  className={`${
                    isActive("/contact") ? "tab active" : "tab"
                  } transition`}
                >
                  Contact
                </span>
              </Link>
            </li>
            <li>
              <Link href="/ticket">
                <span
                  className={`${
                    isActive("/ticket") ? "tab active" : "tab"
                  } transition`}
                >
                  Ticket
                </span>
              </Link>
            </li>
            <li>
              <Link href="/trademark">
                <span
                  className={`${
                    isActive("/trademark") ? "tab active" : "tab"
                  } transition`}
                >
                  Trademark
                </span>
              </Link>
            </li>
            {organization && organization?.publicMetadata?.is_connection && (
              <li>
                <span
                  className={`${
                    isActive("/connect") ? "tab active" : "tab"
                  } transition`}
                  onClick={() => openInPopup("/connect")}
                >
                  Connection
                </span>
              </li>
            )}
            {organization && organization?.publicMetadata?.is_explore && (
              <li>
                <span
                  className={`${
                    isActive("/explore") ? "tab active" : "tab"
                  } transition`}
                  onClick={() => openInPopup("/explore")}
                >
                  Explore
                </span>
              </li>
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <Dropdown menu={{ items, onClick }}>
            <span className={`tab transition`}>Setup</span>
          </Dropdown>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </div>
  );
}
