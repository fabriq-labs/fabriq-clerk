"use client";

import React from "react";
import { Table, Tooltip } from "antd";
import Image from "next/image";

import StackedBarChart from "@/components/chart/stackedBarChart";
import { formatNumber } from "@/utils/helper";

export function SocialCard({ distributionData, topAuthorsMedium }: any) {
  const socialValue =
    distributionData?.referrer?.Social?.value ||
    distributionData?.referrer?.social?.value ||
    0;
  const socialPercentage =
    distributionData?.referrer?.Social?.percentage ||
    distributionData?.referrer?.social?.percentage ||
    0;
  const hasTopSocial = socialValue !== 0 && topAuthorsMedium?.social;

  return (
    <div className="card">
      <div className="row1">
        <Image src={"/images/network.png"} alt="social" width={24} height={24} />
        <div className="row-title">Social</div>
      </div>
      <div className="row2" style={{ color: "#172a95" }}>
        {formatNumber(socialValue)}&nbsp;
        <span className="percentage">{socialPercentage}%</span>
      </div>
      <div className="row3">
        {hasTopSocial ? (
          <div>
            <div style={{ color: "#172a95" }} title={topAuthorsMedium?.social}>
              {topAuthorsMedium?.social}
            </div>{" "}
            <div className="top-title-heading">Top Social</div>
          </div>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
}

export function ReferralCard({ distributionData, topAuthorsMedium }: any) {
  const referralValue =
    distributionData?.referrer?.Referral?.value ||
    distributionData?.referrer?.unknown?.value ||
    0;
  const referralPercentage =
    distributionData?.referrer?.Referral?.percentage ||
    distributionData?.referrer?.unknown?.percentage ||
    0;
  const hasTopReferral = referralValue !== 0 && topAuthorsMedium?.unknown;

  return (
    <div className="card">
      <div className="row1">
        <Image src={"/images/referral_new.png"} alt="referral" width={24} height={24} />
        <div className="row-title">Referral</div>
      </div>
      <div className="row2" style={{ color: "#f8b633" }}>
        {formatNumber(referralValue)}&nbsp;
        <span className="percentage">{referralPercentage}%</span>
      </div>
      <div className="row3">
        {hasTopReferral ? (
          <div>
            <div
              style={{
                color: "#f8b633",
                cursor: "pointer",
                fontSize: "12px",
              }}
              title={topAuthorsMedium?.unknown}
              className="top-url-author"
            >
              {topAuthorsMedium?.unknown}
            </div>{" "}
            <div className="top-title-heading">Top Referral</div>
          </div>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
}

export function SearchCard({ distributionData, topAuthorsMedium }: any) {
  const searchValue =
    distributionData?.referrer?.search?.value ||
    distributionData?.referrer?.Search?.value ||
    0;
  const searchPercentage =
    distributionData?.referrer?.search?.percentage ||
    distributionData?.referrer?.Search?.percentage ||
    0;
  const hasTopSearch = searchValue !== 0 && topAuthorsMedium?.search;

  return (
    <div className="card">
      <div className="row1">
        <Image src={"/images/search.png"} alt="search" width={24} height={24} />
        <div className="row-title">Search</div>
      </div>
      <div className="row2" style={{ color: "#e63111" }}>
        {formatNumber(searchValue)}&nbsp;
        <span className="percentage">{searchPercentage}%</span>
      </div>
      <div className="row3">
        {hasTopSearch ? (
          <div>
            <div
              style={{
                color: "#e63111",
                fontSize: "12px",
              }}
              title={topAuthorsMedium?.search}
            >
              {topAuthorsMedium?.search}
            </div>{" "}
            <div className="top-title-heading">Top Search</div>
          </div>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
}

export function InternalCard({ distributionData, topAuthorsMedium }: any) {
  const internalValue =
    distributionData?.referrer?.Internal?.value ||
    distributionData?.referrer?.internal?.value ||
    0;
  const internalPercentage =
    distributionData?.referrer?.Internal?.percentage ||
    distributionData?.referrer?.internal?.percentage ||
    0;
  const hasTopInternal = internalValue !== 0 && topAuthorsMedium?.internal;

  function extractTitleFromURL(url: any) {
    if (url) {
      const parts = url.split("/").filter((part: any) => part.trim() !== "");

      // Find the last non-empty part and remove any query parameters
      for (let i = parts.length - 1; i >= 0; i--) {
        const lastPart = parts[i].split("?")[0].replace(/-/g, " ");
        if (!/\d/.test(lastPart)) {
          return lastPart;
        }
      }

      // If no valid title is found, return 'No title found'
      return "-";
    }
  }

  const title = extractTitleFromURL(topAuthorsMedium?.internal) || "";

  return (
    <div className="card">
      <div className="row1">
        <Image src={"/images/minimize.png"} alt="internal" width={24} height={24} />
        <div className="row-title">Internal</div>
      </div>
      <div className="row2" style={{ color: "#0add54" }}>
        {formatNumber(internalValue)}&nbsp;
        <span className="percentage">{internalPercentage}%</span>
      </div>
      <div className="row3">
        {hasTopInternal ? (
          <div>
            <a
              style={{ color: "#0add54", cursor: "pointer", fontSize: "12px" }}
              title={title}
              className="top-url-internal"
              href={title}
              target="_blank"
              rel="noreferrer"
            >
              {title}
            </a>{" "}
            <div className="top-title-heading">Top Internal</div>
          </div>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
}

export function DirectCard({ distributionData }: any) {
  const directValue =
    distributionData?.referrer?.Direct?.value ||
    distributionData?.referrer?.Other?.value ||
    0;
  const directPercentage =
    distributionData?.referrer?.Direct?.percentage ||
    distributionData?.referrer?.Other?.percentage ||
    0;

  return (
    <div className="card">
      <div className="row1">
        <Image src={"/images/direct.png"} alt="direct" width={24} height={24} />
        <div className="row-title">Direct</div>
      </div>
      <div className="row2" style={{ color: "#7f9386" }}>
        {formatNumber(directValue)}&nbsp;
        <span className="percentage">{directPercentage}%</span>
      </div>
    </div>
  );
}

export const DetailsCard = (props: any) => {
  const {
    title,
    current_percentage,
    average_percentage,
    description,
    tooltipTitle,
  } = props;

  let currentvalue = `${current_percentage}%`;
  let averageValue = `${average_percentage}%`;
  return (
    <div className="details-id-card-wrapper">
      <div className="details-id-card-content">
        <div className="id-card-title">
          <Tooltip title={tooltipTitle}>{title}</Tooltip>
        </div>
        <div className="id-card-current-percentage">{currentvalue}</div>
        <div className="id-card-divider"></div>
        <div className="id-card-average-value">{averageValue}</div>
        <div className="id-card-description" style={{ margin: "0 0 34px 0" }}>
          {description}
        </div>
      </div>
    </div>
  );
};

export const BreakDownData = (props: any) => {
  const { columns, data, tableValue } = props;

  return (
    <div className="breakdown-data-wrapper">
      <div className="breakdown-value-content">
        <div>
          {" "}
          <StackedBarChart series={data} legend={false} height={80} />
        </div>
        <div style={{ padding: "0 30px" }}>
          <Table
            columns={columns}
            dataSource={tableValue}
            pagination={false}
            className="custom-table"
            scroll={{ y: 300 }}
          />
        </div>
      </div>
    </div>
  );
};
