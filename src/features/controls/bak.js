import React, { useState } from 'react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetAvailabilityQuery,
  useGetForcesQuery,
} from '../../services/policeAPI';

function controls() {
  const [dateValue, setDateValue] = useState('');
  const [forceDisabled, setForceDisabled] = useState(true);
  const [forceValue, setForceValue] = useState('police-force');
  const [hasSelection, setHasSelection] = React.useState(false);

  const storeHasSelection = useSelector((state) => state.hasSelection);

  useEffect(() => {
    if (storeHasSelection !== hasSelection) {
      setHasSelection(storeHasSelection);
    }
  }, [storeHasSelection]);

  const dispatch = useDispatch();
  const {
    data: forcesList,
    error: forcesList_error,
    isLoading: forcesList_isLoading,
    isSuccess: forcesList_isSuccess,
    isError: forcesList_isError,
  } = useGetForcesQuery();
  const {
    data: availablityData,
    error: availablityData_error,
    isLoading: availablityData_isLoading,
    isSuccess: availablityData_isSuccess,
    isError: availablityData_isError,
  } = useGetAvailabilityQuery();

  const handleDateChange = (event) => {
    setDateValue(event.target.value);
    const selectedDate = new Date(event.target.value);
    dispatch({ type: 'SET_DATE', payload: selectedDate });
    setForceDisabled(false);
    dispatch({
      type: 'HAS_SELECTION_FALSE',
      payload: false,
    });
  };

  const handleForceChange = (event) => {
    const forceID = event.target.value;
    const forceName = forcesList.find((item) => item.id === event.target.value);
    console.log(forceName);
    setForceValue(event.target.value);

    dispatch({
      type: 'HAS_SELECTION_FALSE',
      payload: false,
    });

    dispatch({
      type: 'SET_FORCE',
      payload: { forceRaw: forceID, forceFormatted: forceName.name },
    });
  };

  const handleGetData = (event) => {
    dispatch({
      type: 'HAS_SELECTION_TRUE',
      payload: true,
    });
    dispatch({
      type: 'SET_BY_FORCE',
      payload: {
        forceRaw: forceValue,
        date: dateValue,
      },
    });
  };

  return (
    <div>
      <div className="card text-bg-light mb-3 py-3 px-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-5 col-sm-12 mb-4">
              {/* Select available dates */}
              <select
                className="form-select"
                value={dateValue}
                onChange={handleDateChange}
              >
                <option className="dropdown-item" value="default">
                  Available Dates
                </option>

                {availablityData_isLoading && 'Loading...'}
                {availablityData_isError && availablityData_error.message}
                {availablityData_isSuccess &&
                  availablityData &&
                  availablityData.map((item) => (
                    <option
                      className="dropdown-item"
                      value={item.date}
                      key={item.date}
                    >
                      {item.date}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-5 col-sm-12 mb-3">
              {/* Select available forces using dates */}
              <select
                className="form-select"
                value={forceValue}
                onChange={handleForceChange}
                disabled={forceDisabled}
              >
                <option className="dropdown" value="default">
                  Available Forces
                </option>
                {availablityData_isLoading && 'Loading...'}
                {availablityData_isError && availablityData_error.message}
                {availablityData_isSuccess &&
                  availablityData &&
                  availablityData.map((outerElement) =>
                    outerElement.date === dateValue
                      ? outerElement['stop-and-search'].map((innerElement) =>
                          forcesList.map((force) =>
                            innerElement === force.id ? (
                              <option value={force.id}>{force.name}</option>
                            ) : null
                          )
                        )
                      : null
                  )}
              </select>
            </div>
            <div className="col-md-2 col-sm-12">
              <button className="btn btn-primary w-100" onClick={handleGetData}>
                Get Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default controls;
