"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Button, Tooltip, Table, Skeleton, Empty, Radio, Pagination } from "antd";
import { useRouter } from "next/navigation";
import Layout from "@components/layout";
import { formatNumber, formationTimezone, getQuarterFromDate } from "@/utils/helper";
import StackedBarChart from "@/components/chart/stackedBarChart";
import moment from "moment";
import LineChartTiny from "@/components/charts/tiny_line_chart";
import { DatepickerComponent } from "@/components/authors/date_picker";
import ErrorResult from "@/components/ErrorResult/error_result";
import { formatDuration } from "@/utils/format_duration";
import Link from "next/link";

let siteDetails: any = undefined

const generateData = (series: any, labels: any) => {
    const finalData = labels?.map((label: any, index: any) => ({
        name: label,
        pageViews: series?.[0]?.data?.[index] || 0
    }));

    return finalData;
};


export const AuthorTableCard = ({
    data,
    handleClickAuthor,
    formatDurationAuthor,
    childrenOpen,
    handleClickChildrenOpen,
    handleClickArticle,
    offsetValue,
    segementValue
}: any) => {
    const [authorDetails, setAuthorDetails] = useState<any>([]);
    const [loading, setLoading] = useState<any>(false);
    const [tableLoader, setTableLoader] = useState<any>(false);
    const [totalCount, setTotalCount] = useState<any>(0);

    const getAuthorDetails = async (authorId: any, limit: any, offset: any, sorting: any) => {
        try {
            setTableLoader(true);
            const articleListReq = {
                site_id: siteDetails?.site_id,
                author_id: authorId,
                limit,
                offset,
                orderBy: sorting
            };

            const {
                data: { data, errors },
            } = await axios.post("/api/author", {
                operation: "getArticlesList",
                variables: articleListReq,
            });
            if (errors) {
                throw errors;
            }

            setAuthorDetails(data?.Articles);
            setTotalCount(data?.totalCount?.aggregate?.count);

            setTableLoader(false);
            if (loading) setLoading(false);
        } catch (error) {
            // notification.error("Error fetching author details");
            setTableLoader(false);
            if (loading) setLoading(false);
        }
    };

    const getAuthorDetailsMonthly = async (record: any, limit: any, offset: any, sorting: any) => {
        try {
            // Calculate start of the month based on the provided value
            const startOfMonth = moment(
                `${record?.period_year}-${record?.period_month
                    ?.toString()
                    .padStart(2, "0")}-01 00:00:00`,
                "YYYY-MM-DD HH:mm:ss"
            ).format("YYYY-MM-DDTHH:mm:ss");

            // Calculate start of the next month
            const startOfNextMonth = moment(
                `${record?.period_year}-${(parseInt(record?.period_month) + 1)
                    .toString()
                    .padStart(2, "0")}-01 00:00:00`,
                "YYYY-MM-DD HH:mm:ss"
            ).format("YYYY-MM-DDTHH:mm:ss");
            setTableLoader(true);
            const articleListReq = {
                site_id: siteDetails?.site_id,
                author_id: record?.author_id,
                limit,
                offset,
                orderBy: sorting,
                period_month: record?.period_month,
                period_year: record?.period_year,
                startOfMonth,
                startOfNextMonth
            };

            const {
                data: { data, errors },
            } = await axios.post("/api/author", {
                operation: "getArticlesListMonthly",
                variables: articleListReq,
            });
            if (errors) {
                throw errors;
            }


            setAuthorDetails(data?.Articles);
            setTotalCount(data?.ArticleCount?.aggregate?.count);

            setTableLoader(false);
            if (loading) setLoading(false);
        } catch (error) {
            // notification.error("Error fetching author details");
            setTableLoader(false);
            if (loading) setLoading(false);
        }
    };

    const getAuthorDetailsQuarterly = async (record: any, limit: any, offset: any, sorting: any) => {
        try {
            const startOfQuarter = moment()
                .quarter(record?.period_quarter)
                .year(record?.period_year)
                .startOf("quarter")
                .format("YYYY-MM-DDTHH:mm:ss");

            const startOfNextQuarter = moment()
                .quarter(record?.period_quarter + 1)
                .year(
                    record?.period_quarter === 4
                        ? record?.period_year + 1
                        : record?.period_year
                )
                .startOf("quarter")
                .format("YYYY-MM-DDTHH:mm:ss");

            setTableLoader(true);
            const articleListReq = {
                site_id: siteDetails?.site_id,
                author_id: record?.author_id,
                limit,
                offset,
                orderBy: sorting,
                period_quarter: record?.period_quarter,
                period_year: record?.period_year,
                startOfQuarter,
                startOfNextQuarter
            };

            const {
                data: { data, errors },
            } = await axios.post("/api/author", {
                operation: "getArticlesListQuarterly",
                variables: articleListReq,
            });

            if (errors) {
                throw errors;
            }

            setAuthorDetails(data?.Articles);
            setTotalCount(data?.ArticleCount?.aggregate?.count);

            setTableLoader(false);
            if (loading) setLoading(false);
        } catch (error) {
            // notification.error("Error fetching author details");
            setTableLoader(false);
            if (loading) setLoading(false);
        }
    };

    const getAuthorDetailsYearly = async (record: any, limit: any, offset: any, sorting: any) => {
        try {
            const startOfYear = moment(record?.period_year, "YYYY")
                .startOf("year")
                .format("YYYY-MM-DDTHH:mm:ss");
            const startOfNextYear = moment(record?.period_year, "YYYY")
                .add(1, "year")
                .startOf("year")
                .format("YYYY-MM-DDTHH:mm:ss");

            setTableLoader(true);
            const articleListReq = {
                site_id: siteDetails?.site_id,
                author_id: record?.author_id,
                limit,
                offset,
                orderBy: sorting,
                period_year: record?.period_year,
                startOfYear,
                startOfNextYear
            };

            const {
                data: { data, errors },
            } = await axios.post("/api/author", {
                operation: "getArticlesListYearly",
                variables: articleListReq,
            });
            if (errors) {
                throw errors;
            }

            setAuthorDetails(data?.Articles);
            setTotalCount(data?.ArticleCount?.aggregate?.count);

            setTableLoader(false);
            if (loading) setLoading(false);
        } catch (error) {
            // notification.error("Error fetching author details");
            setTableLoader(false);
            if (loading) setLoading(false);
        }
    };

    const getAuthorDetailsRealTime = async (record: any, limit: any, offset: any, sorting: any) => {
        try {
            setTableLoader(true);
            const articleListReq = {
                site_id: siteDetails?.site_id,
                author_id: record?.author_id,
                limit,
                offset,
                orderBy: sorting,
                period_date: record?.period_date,
                partical_period_date: `${record?.period_date}%`
            };

            const {
                data: { data, errors },
            } = await axios.post("/api/author", {
                operation: "getArticlesListRealTime",
                variables: articleListReq,
            });

            if (errors) {
                throw errors;
            }

            setAuthorDetails(data?.Articles);
            setTotalCount(data?.ArticleCount?.aggregate?.count);

            setTableLoader(false);
            if (loading) setLoading(false);
        } catch (error) {
            // notification.error("Error fetching author details");
            setTableLoader(false);
            if (loading) setLoading(false);
        }
    };

    const openItem = (index: any) => {
        setLoading(true);

        handleClickChildrenOpen(index, setLoading);
    };

    return (
        <div className="author-table-card-wrapper">
            <div className="author-table-header">
                <Row gutter={[16, 16]} className="table-card-row">
                    <Col
                        className="table-heading"
                        span={6}
                        style={{ paddingLeft: "55px" }}
                    >
                        <Tooltip title="The creator or writer of the content">
                            Author
                        </Tooltip>
                    </Col>
                    <Col className="text-center table-heading" span={5}>
                        {segementValue === "real-time" ? (
                            <Tooltip title="Number of page views in the last 24 hours">
                                Page Views: 24 Hours
                            </Tooltip>
                        ) : (
                            <Tooltip title="Number of page views in the last 30 days">
                                Page Views: 30 Days
                            </Tooltip>
                        )}
                    </Col>
                    <Col className="text-center table-heading" span={3} />
                    <Col className="text-right table-heading" span={3}>
                        <Tooltip title="Percentage of users who visit another page on the site after the initial page.">
                            Recirculation (%)
                        </Tooltip>
                    </Col>
                    <Col className="text-right table-heading" span={3}>
                        <Tooltip title="The level of complexity of the text, its familiarity, legibility and typography all feed into how readable your content is.">
                            Readability
                        </Tooltip>
                    </Col>
                    <Col className="text-center table-heading" span={3}>
                        Count
                    </Col>
                    <Col className="text-center table-heading" span={1} />
                </Row>
            </div>
            {data?.length > 0 ? (
                data?.map((record: any, index: any) => (
                    <div className="author-table-body">
                        <Row gutter={[16, 16]} className="table-card-row">
                            <Col span={6}>
                                <div style={{ display: "flex" }}>
                                    <span
                                        style={{
                                            marginRight: "15px",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            color: "#737a73",
                                            textAlign: "center",
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        {offsetValue + index + 1}
                                    </span>
                                    <div className="list-author-logo">
                                        {" "}
                                        <img
                                            src={
                                                record?.image_url ||
                                                `/images/avatars/image-${index + 1}.png`
                                            }
                                            alt="blog"
                                            style={{ width: "70px" }}
                                            className="author-logo-img"
                                        />
                                    </div>
                                    <Link
                                        href={`/content/author/${record.author_id}`}
                                        className="hover-title"
                                        onClick={() =>
                                            handleClickAuthor(record.author_id, record.index)
                                        }
                                    >
                                        {record?.name}
                                    </Link>
                                </div>
                            </Col>
                            <Col span={5}>
                                <div style={{ width: "100%", height: "100px" }}>
                                    <LineChartTiny
                                        data={generateData(record?.series, record?.labels)}
                                        dataKey={"pageViews"}
                                        updatedLabels={record?.labels}
                                    />
                                </div>
                            </Col>
                            <Col className="text-center vistor-count" span={3}>
                                <div className="list-view-count-author">
                                    <div className="list-view-minutes-author">
                                        <span className="list-value-author-list">
                                            {formatDurationAuthor(record?.total_time_spent)}
                                        </span>
                                        <span className="list-label">Total Spent</span>
                                    </div>
                                    <div className="list-minutes-vistor-author">
                                        <span className="list-value-author-list">
                                            {formatDurationAuthor(record?.average_time_spent)}
                                        </span>
                                        <span className="list-label">Per Visitor</span>
                                    </div>
                                </div>
                            </Col>
                            <Col className="text-center vistor-count" span={3}>
                                {record?.recirculation || 0} %
                            </Col>
                            <Col className="text-center vistor-count" span={3}>
                                {record?.readability || 0} %
                            </Col>
                            <Col className="text-center" span={3}>
                                {record?.published_articles?.toLocaleString()}
                            </Col>
                            <Col className="text-center" span={1}>
                                <div
                                    className={`see-btn ${loading || record?.published_articles === 0
                                        ? "disabled"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        openItem(index);
                                    }}
                                >
                                    <img
                                        src={
                                            childrenOpen === index
                                                ? "/images/upload.png"
                                                : "/images/down-arrow_nw.png"
                                        }
                                        alt="Icon"
                                        height={16}
                                        width={16}
                                    />
                                </div>
                            </Col>
                        </Row>
                        {childrenOpen === index && (
                            <div className="expand-author">
                                <ExpandedRow
                                    record={record}
                                    handleClickArticle={handleClickArticle}
                                    siteLink={siteDetails?.host_name}
                                    getAuthorDetails={getAuthorDetails}
                                    segementValue={segementValue}
                                    getAuthorDetailsMonthly={getAuthorDetailsMonthly}
                                    getAuthorDetailsQuarterly={getAuthorDetailsQuarterly}
                                    getAuthorDetailsYearly={getAuthorDetailsYearly}
                                    getAuthorDetailsRealTime={getAuthorDetailsRealTime}
                                    authorDetails={authorDetails}
                                    loading={loading}
                                    tableLoader={tableLoader}
                                    totalCount={totalCount}
                                />
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <Empty description="No data" />
            )}
        </div>
    );
};
const ExpandedRow = ({
    record,
    handleClickArticle,
    siteLink,
    getAuthorDetails,
    authorDetails,
    loading,
    tableLoader,
    totalCount,
    segementValue,
    getAuthorDetailsMonthly,
    getAuthorDetailsQuarterly,
    getAuthorDetailsYearly,
    getAuthorDetailsRealTime
}: any) => {
    const [limit, setLimit] = useState<any>(5);
    const [offset, setOffset] = useState<any>(0);

    const [currentSorting, setCurrentSorting] = useState<any>({
        field: "published_date",
        direction: "desc"
    });

    useEffect(() => {
        if (segementValue === "monthly") {
            getAuthorDetailsMonthly(record, limit, offset, currentSorting);
        } else if (segementValue === "quarterly") {
            getAuthorDetailsQuarterly(record, limit, offset, currentSorting);
        } else if (segementValue === "yearly") {
            getAuthorDetailsYearly(record, limit, offset, currentSorting);
        } else {
            getAuthorDetailsRealTime(record, limit, offset, currentSorting);
        }
    }, [record.author_id, limit, offset, currentSorting]);

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        if (sorter?.columnKey) {
            const sortingDirections: any = {
                published_date: sorter.order === "ascend" ? "asc" : "desc",
                page_views:
                    sorter.order === "ascend" ? "asc_nulls_first" : "desc_nulls_last",
                users: sorter.order === "ascend" ? "asc_nulls_first" : "desc_nulls_last"
            };

            const sorting = {
                field: sorter.columnKey,
                direction: sortingDirections[sorter.columnKey] || "asc"
            };

            setCurrentSorting(sorting);
        }
    };

    const handlePaginationChange = (newOffset: any, newLimit: any) => {
        setOffset(newOffset);
        setLimit(newLimit);
    };

    const columns: any = [
        {
            title: "Article",
            dataIndex: "title",
            width: "50%",
            render: (_text: any, record: any) => (
                <div className="author-article-title-wrapper">
                    <Link
                        href={`/content/article/${record?.article_id}`}
                        className="author-article-title"
                        onClick={() => handleClickArticle(record?.article_id)}
                    >
                        <Tooltip title={record?.title}>{record?.title}</Tooltip>
                        <>&nbsp;</>
                    </Link>
                    <div className="author-article-details">
                        <div className="author-article-published">
                            {formationTimezone(record?.published_date)}
                        </div>
                        <div className="author-article-category">{record?.category}</div>
                        <div className="author-article-link-title">
                            <a
                                href={`${siteLink}/story/${record?.title}/${record?.article_id}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={"/images/open-link.webp"}
                                    alt="link"
                                    style={{
                                        width: "12px",
                                        height: "12px"
                                    }}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Published Date",
            dataIndex: "published_date",
            sorter: true,
            render: (_text: any, record: any) => (
                <span className="list-value-author-list">
                    {formationTimezone(record?.published_date)}
                </span>
            )
        },
        {
            title: " Page Views",
            dataIndex: "page_views",
            sorter: true,
            align: "right",
            render: (_text: any, record: any) => (
                <span className="list-value-author-list">
                    {record?.page_views?.toLocaleString() || 0}
                </span>
            )
        },
        {
            title: "Readers",
            dataIndex: "users",
            sorter: true,
            align: "right",
            render: (_text: any, record: any) => (
                <span className="list-value-author-list">
                    {record?.users?.toLocaleString() || 0}
                </span>
            )
        }
    ];

    let rows = [];
    if (authorDetails?.length > 0) {
        let rowKeys = Object.keys(authorDetails?.[0]);
        authorDetails.forEach((row: any, index: any) => {
            let eachRow: any = {};
            eachRow.key = index + 1;
            rowKeys.forEach((eachRowKey: any) => {
                eachRow[eachRowKey] = row[eachRowKey];
            });

            rows.push(eachRow);
        });
    }

    return (
        <div className="author-article-wrapper">
            {loading ? (
                <Skeleton active />
            ) : (
                authorDetails?.length > 0 && (
                    <Table
                        columns={columns}
                        dataSource={authorDetails}
                        loading={{
                            indicator: <Skeleton active paragraph={{ rows: 0 }} />,
                            spinning: tableLoader
                        }}
                        pagination={{
                            total: totalCount,
                            // position: "top",
                            pageSize: 5,
                            onChange: (page, pageSize) => {
                                const newOffset = (page - 1) * pageSize;
                                handlePaginationChange(newOffset, pageSize);
                            }
                        }}
                        onChange={handleTableChange}
                    />
                )
            )}
            {!loading && authorDetails?.length === 0 && (
                <Empty description="No Articles available" />
            )}
        </div>
    );
};

export default function AuthorList() {
    const [authorData, setAuthorData] = useState<any>([]);
    const [loader, setLoader] = useState<any>(false);
    const [currentpage, setCurrentPage] = useState<any>(1);
    const [totalCount, setTotalCount] = useState<any>(0);
    const [childrenOpen, setChildrenOpen] = useState<any>(null);
    const [offsetValue, setOffsetValue] = useState<any>(0);
    const [isError, setIsError] = useState<any>(false);
    const [segementValue, setSegementValue] = useState<any>("real-time");
    const [selectedMonth, setSelectedMonth] = useState<any>(null);
    const [selectedYear, setSelectedYear] = useState<any>(null);
    const [selectedQuarter, setSelectedQuarter] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<any>(new Date());
    const siteInfo: any = {
        id: 36,
        site_id: "wral.com",
        site_name: "Fabriq",
        host_name: "https://fabriq.com",
        collector_url: "wral.com/dt",
    };
    // const article_authors_query_id = useSelector(
    //     (state) => state?.home?.queryIds?.authors_realtime_query_id
    // );

    useEffect(() => {
        getCachedList();
    }, []);

    function timeRange(ms: any) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const fetchDataFromJob = async (jobData: any): Promise<any> => {
        try {
            const response = await axios.get(`/api/get_jobs/${jobData?.job.id}`);
            const { data } = response;

            if (data.job.status < 3) {
                await timeRange(3000);
                return fetchDataFromJob(data);
            } else if (data.job.status === 3) {
                return data.job.result;
            } else if (data.job.status === 4 && data.job.error.code === 1) {
                return [];
            } else {
                throw new Error(data.job.error);
            }
        } catch (error: any) {
            // error
        }
    };

    const getResultFromJob = (data: any, topPostvariables: any) => {
        return fetchDataFromJob(data).then((res) => {
            if (res) {
                return axios
                    .post("/api/query_results", { data: topPostvariables })
                    .then((result) => {
                        let resultData = result?.data?.query_result;
                        return resultData;
                    })
                    .catch((err) => {
                        throw err;
                    });
            }
        });
    };

    const getCachedList = async () => {
        const query_id = 436;
        setLoader(true);
        setIsError(false);
        const variables: any = {
            parameters: {
                site_id: `"${siteDetails?.site_id}"`
            },
            max_age: -1,
            id: query_id
        };

        try {
            const topPostvariables = {
                parameters: {
                    site_id: `"${siteInfo?.site_id}"`,
                },
                max_age: -1,
                id: 430,
            };

            const values = await axios.post("/api/query_results", { data: topPostvariables })
            const { data } = values;

            if ("job" in data) {
                // If "job" is in the response, poll the job
                const result = await getResultFromJob(data, variables);
                const authorIds = result?.data?.data?.authors?.map(
                    (item: any) => item?.author_id
                );

                setOffsetValue(0);
                setAuthorData(result?.data?.data?.authors);
                setTotalCount(result?.data?.data?.totalCount?.aggregate?.count);
                getLast24HoursForAuthor(result?.data?.data?.authors, authorIds);
            } else {
                // If "job" is not in the response, proceed with "query_result"
                const result = values?.data?.query_result?.data?.data?.authors;

                const authorIds = result?.map((item: any) => item?.author_id);

                if (result) {
                    setOffsetValue(0);
                    setAuthorData(result);
                    setTotalCount(
                        values?.data?.query_result?.data?.data?.totalCount?.aggregate?.count
                    );
                    getLast24HoursForAuthor(result, authorIds);
                } else {
                    setLoader(false);
                    setIsError(true);
                }
            }
            setLoader(false);
        } catch (err) {
            setLoader(false);
            setIsError(true);
        }
    };

    const getAuthorDetails: any = async (date: any, page: any) => {
        setLoader(true);

        // Format the date to "YYYY-MM-DD" format
        let period_date = date || formationTimezone(moment(), "YYYY-MM-DD");

        const limitPerPage = 10;
        const offset = limitPerPage * ((page || currentpage) - 1);

        // try {
        //   const values = await AuthorList.get_author_list_realtime(
        //     siteDetails?.site_id,
        //     period_date,
        //     offset,
        //     `${period_date}%`
        //   );

        //   if (values?.data?.data?.Authors) {
        //     const result = values?.data?.data?.Authors;

        //     const authorIds = result?.map((item) => item?.author_id);
        //     setOffsetValue(offset);
        //     getLast30DaysForAuthor(result, authorIds);
        //   }
        // } catch (err) {
        //   setLoader(false);
        //   notification.error(err?.message);
        // }
    };

    const getMonthlyData = async (value: any, year: any, page = null) => {
        setIsError(false);
        setLoader(true);
        const limitPerPage = 10;
        const offset = limitPerPage * ((page || currentpage) - 1);

        // Calculate start of the month based on the provided value
        const startOfMonth = moment(
            `${year}-${value?.toString().padStart(2, "0")}-01 00:00:00`,
            "YYYY-MM-DD HH:mm:ss"
        ).format("YYYY-MM-DDTHH:mm:ss");

        // Calculate start of the next month
        const startOfNextMonth = moment(
            `${year}-${(parseInt(value) + 1)
                .toString()
                .padStart(2, "0")}-01 00:00:00`,
            "YYYY-MM-DD HH:mm:ss"
        ).format("YYYY-MM-DDTHH:mm:ss");

        try {
            const req = {
                site_id: siteDetails?.site_id,
                period_month: parseInt(value),
                period_year: year,
                offset: offset,
                startOfMonth: startOfMonth,
                startOfNextMonth: startOfNextMonth
            }
            const {
                data: { data, errors },
            } = await axios.post("/api/author", {
                operation: "get_authors_monthly",
                variables: req,
            });

            if (errors) {
                throw errors;
            }

            const authorIds = data?.Authors?.map((item: any) => item?.author_id);

            setOffsetValue(offset);
            setAuthorData(data?.Authors);
            setTotalCount(data.totalCount?.aggregate?.count);
            getLast30DaysForAuthor(data?.Authors, authorIds);
        } catch (err) {
            setLoader(false);
            setIsError(true);
        }
    };

    const getQuarterlyData = async (value: any, year: any, page = null) => {
        setIsError(false);
        setLoader(true);
        const limitPerPage = 10;
        const offset = limitPerPage * ((page || currentpage) - 1);

        const startOfQuarter = moment()
            .quarter(value)
            .year(year)
            .startOf("quarter")
            .format("YYYY-MM-DDTHH:mm:ss");

        const startOfNextQuarter = moment()
            .quarter(value + 1)
            .year(value === 4 ? year + 1 : year)
            .startOf("quarter")
            .format("YYYY-MM-DDTHH:mm:ss");

        try {

            const req = {
                site_id: siteDetails?.site_id,
                period_month: parseInt(value),
                period_year: year,
                offset: offset,
                startOfQuarter: startOfQuarter,
                startOfNextQuarter: startOfNextQuarter
            }
            const {
                data: { data, errors },
            } = await axios.post("/api/author", {
                operation: "get_authors_quarterly",
                variables: req,
            });

            if (errors) {
                throw errors;
            }

            const authorIds = data?.Authors?.map((item: any) => item?.author_id);

            setOffsetValue(offset);
            setAuthorData(data?.Authors);
            setTotalCount(data.totalCount?.aggregate?.count);
            getLast30DaysForAuthor(data?.Authors, authorIds);
        } catch (err) {
            setLoader(false);
            setIsError(true);
        }
    };

    const getYearlyData = async (value: any, page = null) => {
        setIsError(false);
        setLoader(true);
        const limitPerPage = 10;
        const offset = limitPerPage * ((page || currentpage) - 1);

        const startOfYear = moment(value, "YYYY")
            .startOf("year")
            .format("YYYY-MM-DDTHH:mm:ss");
        const startOfNextYear = moment(value, "YYYY")
            .add(1, "year")
            .startOf("year")
            .format("YYYY-MM-DDTHH:mm:ss");

        try {
            const req = {
                site_id: siteDetails?.site_id,
                period_month: parseInt(value),
                offset: offset,
                startOfYear: startOfYear,
                startOfNextYear: startOfNextYear
            }
            const {
                data: { data, errors },
            } = await axios.post("/api/author", {
                operation: "get_authors_yearly",
                variables: req,
            });
            if (errors) {
                throw errors;
            }

            const authorIds = data?.Authors?.map((item: any) => item?.author_id);

            setOffsetValue(offset);
            setAuthorData(data?.Authors);
            setTotalCount(data.totalCount?.aggregate?.count);
            getLast30DaysForAuthor(data?.Authors, authorIds);
        } catch (err) {
            setLoader(false);
            setIsError(true);
        }
    };

    const getLast24HoursForAuthor = async (result: any, authorIds: any) => {
        const real_time =
            localStorage.getItem("real_time_date") ||
            formationTimezone(moment(), "YYYY-MM-DD");
        if (authorIds?.length > 0) {
            const req = {
                period_date: real_time,
                site_id: siteDetails?.site_id,
                author_id: authorIds
            };

            const res = await axios.post("/api/author", {
                operation: "getLast24HoursForAuthor",
                variables: req,
            });

            const lableValue = Array.from({ length: 24 }, (_, i) => i);

            const response = res?.data?.data?.last24HoursData;
            let obj: any = {};
            if (response?.length > 0) {
                response.forEach((authorItem: any) => {
                    const author_id = authorItem?.author_id;

                    if (!obj[author_id]) {
                        obj[author_id] = {
                            series: [
                                {
                                    name: "Page Views",
                                    data: lableValue.map(() => 0)
                                }
                            ],
                            labels: lableValue.map((item) =>
                                moment(item, "H").format("h:mm a")
                            )
                        };
                    }

                    const hourIndex = authorItem?.period_hour;

                    if (hourIndex !== -1) {
                        obj[author_id].series[0].data[hourIndex] = authorItem?.page_views;
                    }
                });
            }

            const updatedResult = result?.map((authorItem: any) => {
                const author_id = authorItem?.author_id;
                const item = { ...authorItem };

                if (obj[author_id]) {
                    item.series = obj[author_id].series;
                    item.labels = obj[author_id].labels;
                }

                return item;
            });

            setLoader(false);
            setAuthorData(updatedResult);
        } else {
            setLoader(false);
        }
    };

    const getLast30DaysForAuthor = async (result: any, authorIds: any) => {
        if (authorIds?.length > 0) {
            let real_time_date = localStorage.getItem("real_time_date");
            const req = {
                period_date:
                    real_time_date || formationTimezone(moment(), "YYYY-MM-DD"),
                site_id: siteDetails?.site_id,
                author_id: authorIds
            };

            const res = await axios.post("/api/author", {
                operation: "getLast30DaysForAuthor",
                variables: req,
            });

            const response = res?.data?.data?.last30DaysDataForAuthor;
            let obj: any = {};
            if (response?.length > 0) {
                response.forEach((authorItem: any) => {
                    const author_id = authorItem?.author_id;

                    if (!obj[author_id]) {
                        obj[author_id] = {
                            series: [
                                {
                                    name: "Page Views",
                                    data: []
                                }
                            ],
                            labels: []
                        };
                    }

                    obj[author_id].series[0].data.push(authorItem?.page_views);
                    let dateFormat = moment(authorItem?.period_date).format("MMM DD");
                    obj[author_id].labels.push(dateFormat);
                });
            }

            const updatedResult = result?.map((authorItem: any) => {
                const author_id = authorItem?.author_id;
                const item = { ...authorItem };

                if (obj[author_id]) {
                    item.series = obj[author_id].series;
                    item.labels = obj[author_id].labels;
                }

                return item;
            });

            setLoader(false);
            setAuthorData(updatedResult);
        } else {
            setLoader(false);
        }
    };

    const formatDurationAuthor = (value: any) => {
        let formattedDuration;
        const duration = moment.duration(value, "seconds");
        formattedDuration = formatDuration(duration, "14px", "15px");
        return formattedDuration;
    };

    const handleClickAuthor = (id: any, index: any) => {
        // navigate(`/content/author/${id}`, { state: { image: index } });
    };

    const handleClickArticle = (id: any) => {
        // navigate(`/content/article/${id}`);
        // dispatch(updateActiveTab("article"));
    };

    const handleMonthChange = (date: any) => {
        const selectedYear = date?.getFullYear();
        const selectedMonth = date.getMonth() + 1;
        setSelectedMonth(date);
        getMonthlyData(selectedMonth, selectedYear);
    };

    const handleDayChange = (date: any) => {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        setSelectedDate(date);
        getAuthorDetails(formattedDate);
    };

    const handleYearChange = (data: any) => {
        const year = data?.getFullYear();
        getYearlyData(year);
        setSelectedYear(data);
    };

    const handleQuarterlyChange = (date: any) => {
        const selectedYear = date?.getFullYear();
        const selectedQuarter = getQuarterFromDate(date);
        getQuarterlyData(selectedQuarter, selectedYear);
        setSelectedQuarter(date);
    };

    const handleChangeSegement = (e: any) => {
        let real_time_date = localStorage.getItem("real_time_date");
        setSegementValue(e.target.value);
        const currentDate = real_time_date ? new Date(real_time_date) : new Date();

        setAuthorData([]);
        setCurrentPage(1);
        setTotalCount(0);
        setChildrenOpen(null);

        if (e.target.value === "monthly") {
            handleMonthChange(currentDate);
        } else if (e.target.value === "yearly") {
            handleYearChange(currentDate);
        } else if (e.target.value === "quarterly") {
            handleQuarterlyChange(currentDate);
        } else if (e.target.value === "real-time") {
            getCachedList();
        }
    };

    const handleChangePagination = (value: any) => {
        setCurrentPage(value);

        if (segementValue === "monthly") {
            const year = selectedMonth?.getFullYear();
            const month = selectedMonth.getMonth() + 1;
            getMonthlyData(month, year, value);
        } else if (segementValue === "quarterly") {
            const year = selectedQuarter?.getFullYear();
            const quarter = getQuarterFromDate(selectedQuarter);
            getQuarterlyData(quarter, year, value);
        } else if (segementValue === "yearly") {
            const year = selectedYear?.getFullYear();
            getYearlyData(year, value);
        } else if (segementValue === "real-time") {
            const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
            getAuthorDetails(formattedDate, value);
        }
    };

    const data = authorData?.map((item: any) => ({
        key: item?.author_id,
        image_url: item?.image_url,
        author_id: item?.author_id,
        total_time_spent: item?.total_time_spent,
        average_time_spent: item?.average_time_spent,
        recirculation: item?.recirculation,
        readability: item?.readability,
        name: item?.author,
        published_articles: item?.published_articles?.aggregate?.count,
        period_month: item?.period_month || null,
        period_year: item?.period_year || null,
        period_date: item?.period_date || null,
        period_quarter: item?.period_quarter || null,
        series: item?.series,
        labels: item?.labels
    }));

    const handleClickChildrenOpen = (value: any, setLoading: any) => {
        if (value === childrenOpen) {
            setChildrenOpen(null);
            setLoading(false);
        } else {
            setChildrenOpen(value);
        }
    };

    function moveUnknownToLast(dataArr: any) {
        const unknownIndex = dataArr?.findIndex(
            (item: any) => item.author_id === "unknown"
        );

        if (unknownIndex !== -1) {
            const unknownItem = dataArr.splice(unknownIndex, 1)[0];
            dataArr.push(unknownItem);
        }

        return dataArr;
    }

    const authorArrayList = moveUnknownToLast(data);


    return (
        <Layout>
            <div className="author-page-wrapper">
                <div className="author-page-content">
                    <div style={{ display: "flex", marginTop: 25 }}>
                        <div className="segement-wrapper">
                            <Radio.Group
                                onChange={handleChangeSegement}
                                value={segementValue}
                                disabled={loader}
                            >
                                <Radio.Button value="real-time">Real-Time</Radio.Button>
                                <Radio.Button value="monthly">Month</Radio.Button>
                                <Radio.Button value="quarterly">Quarter</Radio.Button>
                                <Radio.Button value="yearly">Year</Radio.Button>
                            </Radio.Group>
                        </div>
                        {segementValue === "real-time" && (
                            <div className="article-DatepickerComponent">
                                <DatepickerComponent
                                    value={selectedDate}
                                    showDatePicker
                                    onChange={handleDayChange}
                                />
                            </div>
                        )}
                        {segementValue === "monthly" && (
                            <div className="article-DatepickerComponent">
                                <DatepickerComponent
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    showMonthYearPicker
                                    dateFormat="yyyy-MM"
                                />
                            </div>
                        )}
                        {segementValue === "quarterly" && (
                            <div className="article-DatepickerComponent">
                                <DatepickerComponent
                                    value={selectedQuarter}
                                    onChange={handleQuarterlyChange}
                                    showQuarterYearPicker
                                    dateFormat="yyyy-QQQ"
                                />
                            </div>
                        )}
                        {segementValue === "yearly" && (
                            <div className="article-DatepickerComponent">
                                <DatepickerComponent
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    showYearPicker
                                    dateFormat="yyyy"
                                />
                            </div>
                        )}
                    </div>
                    <>
                        <div className="author-page-pagination">
                            <Pagination
                                defaultCurrent={1}
                                current={currentpage}
                                total={totalCount}
                                onChange={handleChangePagination}
                            />
                        </div>
                        <div className="author-list-table-wrapper">
                            {loader ? (
                                <div className="center-div">
                                    <Skeleton active />
                                </div>
                            ) : isError ? (
                                <div className="author-page-error-result">
                                    <ErrorResult />
                                </div>
                            ) : (
                                <AuthorTableCard
                                    data={authorArrayList}
                                    formatDurationAuthor={formatDurationAuthor}
                                    handleClickAuthor={handleClickAuthor}
                                    handleClickChildrenOpen={handleClickChildrenOpen}
                                    childrenOpen={childrenOpen}
                                    handleClickArticle={handleClickArticle}
                                    offsetValue={offsetValue}
                                    segementValue={segementValue}
                                />
                            )}
                        </div>
                    </>
                </div>
            </div>
        </Layout>
    )
}
