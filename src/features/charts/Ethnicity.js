import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetByForceQuery } from '../../services/policeAPI';
import { Bar } from 'react-chartjs-2';
import color from 'color';

function chartEthnicity() {
  const searchBy = useSelector((state) => state.searchBy.byForce);
  const force = useSelector((state) => state.force);
  const startDate = useSelector((state) => state.startDate);
  const [labels, setLabels] = useState([]);
  const {
    data: availablityData,
    isLoading,
    isSuccess,
    isError,
  } = useGetByForceQuery(searchBy);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Ethnicity',
        data: [],
        backgroundColor: 'rgba(30, 81, 123, 0.6)',
      },
    ],
  });

  useEffect(() => {
    if (isSuccess) {
      const ethnicityCount = {};
      availablityData.forEach((item) => {
        if (
          !ethnicityCount[item.officer_defined_ethnicity] &&
          item.officer_defined_ethnicity != null
        ) {
          ethnicityCount[item.officer_defined_ethnicity] = 0;
        }
        if (item.officer_defined_ethnicity != null)
          ethnicityCount[item.officer_defined_ethnicity] += 1;
      });

      const labels = Object.keys(ethnicityCount);
      const data = Object.values(ethnicityCount);
      const backgroundColor = labels.map((label, index) => {
        return color('rgba(30, 81, 123, 0.6)')
          .lighten((index / labels.length) * 1.0)
          .hex();
      });
      setLabels(labels);
      setChartData({
        labels: Object.keys(ethnicityCount),
        datasets: [
          {
            label: '',
            data,
            backgroundColor,
          },
        ],
      });
    }
  }, [isSuccess, availablityData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: true,
        text: force.forceFormatted + ' ' +
        new Date(startDate).toLocaleDateString('en-GB', {
          month: 'short',
          year: 'numeric',
        }),
      },
    },
  };

  return (
    <div className="card text-bg-light">
      <div className="card-body">
        <h5 className="card-title">Ethnicity</h5>
        {isLoading ? (
          <p>loading...</p>
        ) : isError ? (
          <p>Error: {isError}</p>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}

export default chartEthnicity;
