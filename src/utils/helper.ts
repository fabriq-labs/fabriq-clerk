export const generateTableData = (data: any) => {
  let columns: any = [];
  columns = data?.columns.map((key: any) => {
    return {
      title: key.name,
      dataIndex: key.name,
      key: key.name,
    };
  });
  const tableData = {
    columns,
    rows: data.rows,
  };

  return tableData;
};


