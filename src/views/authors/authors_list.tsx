"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Button, Tooltip, Table } from "antd";
import { useRouter } from "next/navigation";
import Layout from "@components/layout";
import { formatNumber } from "@/utils/helper";
import StackedBarChart from "@/components/chart/stackedBarChart";



export default function AuthorList() {
    return(
        <Layout>
            <div className="authors-container"> authors</div>
        </Layout>
    )
}