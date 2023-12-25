import React from "react";
import countryData from "./countries.json";

// Define the functions to generate year and month options
function generateYearOptions() {
    const startYear = 1950;
    const endYear = 2050;
    const yearOptions = [];
  
    for (let year = startYear; year <= endYear; year++) {
      yearOptions.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
  
    return yearOptions;
  }
  
  function generateMonthOptions() {
    const monthOptions = [];
  
    for (let month = 1; month <= 12; month++) {
      monthOptions.push(
        <option key={month} value={month}>
          {month}
        </option>
      );
    }
  
    return monthOptions;
  }

function Form() {
    const [formError, setFormError] = React.useState(false);

    const [formData, setFormData] = React.useState({
        country: "",
        year: "",
        month: ""
    });

    const[holidayData, setHolidayData] = React.useState(
        {
            holidays: []
        }
    )

    console.log(formData)
    console.log(holidayData)
    
    const [countryOptions, setCountryOptions] = React.useState([]);

    React.useEffect(() => {
        const options = countryData.map((country) => (
            <option key={country.iso} value={country.iso}>
                {country.name}
            </option>
        ));
        setCountryOptions(options);
    }, []);

    function handleChange(event) {
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!formData.country || !formData.year || !formData.month) {
            setFormError(true);
            return;
        }

        const apiUrl = `https://calendarific.com/api/v2/holidays?api_key=TbBbYsK7bzOzjXtoHHvCYrSSYWkYM3E2&country=${formData.country}&year=${formData.year}&month=${formData.month}`;

        try {
            const response = await fetch(apiUrl)

            if (!response.ok) {
                console.error("API request failed!")
                return;
            }

            const data= await response.json();

                // Filter out duplicate holidays by name
            const uniqueHolidays = data.response.holidays.reduce((unique, holiday) => {
                if (!unique.some((h) => h.name === holiday.name)) {
                unique.push(holiday);
                }
                return unique;
            }, []);
  

            setHolidayData((prevHolidayData) => ({
                ...prevHolidayData,
                holidays: uniqueHolidays,
            }));
            setFormError(false);
        }   catch(error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <div className="container">
            {formError && (<div className="error--message">Please select a country, year, and month</div>)}
            <form className="form" onSubmit={handleSubmit}>
                <div className="form--option">
                    <label htmlFor="countryInput">Country </label>
                    <select 
                        id="countryInput" 
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                    >
                        <option value="">--choose a country--</option>
                        {countryOptions}
                    {/* Add more country options as needed */}
                    </select>
                </div>
                <div className="form--option">
                    <label htmlFor="yearInput">Year </label>
                    <select 
                        id="yearInput" 
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                    >
                        <option value="">--choose a year--</option>
                        {generateYearOptions()}
                    {/* Add more year options as needed */}
                    </select>
                </div>
                <div className="form--option">
                    <label htmlFor="monthInput">Month </label>
                    <select 
                        id="monthInput" 
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                    >
                        <option value="">--choose a month--</option>
                        {generateMonthOptions()}
                    {/* Add more month options as needed */}
                    </select>
                </div>
                <br />
                <button>Get Holidays</button>
            </form>

            {/* Display holiday data */}
            {holidayData.holidays.length > 0 && (
                <div className="holiday-list">
                    <h2>Holidays</h2>
                    {holidayData.holidays.map((holiday) => (
                        <div key={holiday.name}>
                            <strong>
                                {holiday.date.iso} | {holiday.name} | {holiday.type}
                            </strong>
                            <p>{holiday.description}</p>
                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    }

export default Form;
