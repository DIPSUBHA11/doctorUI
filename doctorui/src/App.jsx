import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import './App.css'
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
function App() {
  const [timeZones, setTimeZones] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeZone, setSelectedTimeZone] = useState('Africa/Abidjan');
  const [timeSlots, setTimeSlots] = useState([]);
  const [event, setEvent] = useState("freeslot");
  const [dateTime, setDateTime] = useState(new Date());
  const [duration, setDuration] = useState(30);
  const [time, setTime] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [getEvent, setGetEvent] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promtMessage, setPromtMessage] = useState("");


  useEffect(() => {
    const fetchTimeZones = () => {
      const timeZoneNames = moment.tz.names();
      setTimeZones(timeZoneNames);
    };

    fetchTimeZones();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const selectTimeZone = (e) => {
    const selectedOption = e.target.value;
    setSelectedTimeZone(selectedOption);
  };

  const fetchFreeSlotData = (e) => {
    axios.get(`http://localhost:3000/freeslot?selectedDate=${selectedDate}&timeZone=${selectedTimeZone}`)
      .then((ele) => {
        setTimeSlots(ele.data)
      })
  }

  const clicktimesection = (slot) => {
    console.log(slot)
  }

  const changeEvent = (event) => {
    setEvent(event)
  }

  const selectDuration = (e) => {
    const selectedOption = e.target.value;
    setDuration(selectedOption)
  }

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const createEvent = () => {
    let newDate = new Date(selectedDate);
    newDate.setHours(time.split(":")[0]);
    newDate.setMinutes(time.split(":")[1]);
    axios.put(`http://localhost:3000/createEvent?selectedDate=${newDate}&duration=${duration}`).then((e) => {
      setPromtMessage(e.data)
      setShowPrompt(true);
    }).catch((err) => {
      setPromtMessage(err.response.data)
      setShowPrompt(true);
    })
  }

  const handlePromptClose = ()=>{
    setShowPrompt(false);
  }

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const getEvents = () => {
    axios.get(`http://localhost:3000/getEvent?startDate=${startDate}&endDate=${endDate}`).then((data) => {
      setGetEvent(data.data)
    })
  }

  return (
    <>
      {showPrompt && (
        <div className="prompt-overlay">
          <div className="prompt-box">
            <h3>{promtMessage==="not gonna created"?"Error!!":"Success!"}</h3>
            <p>{promtMessage}</p>
            <button onClick={handlePromptClose}>OK</button>
          </div>
        </div>
      )}
      <ul className='parentUIElement'>
        <li><button onClick={() => { changeEvent("freeslot") }}>Get Free Slots</button></li>
        <li><button onClick={() => { changeEvent("createEvent") }}>Create Event Creation</button></li>
        <li><button onClick={() => { changeEvent("eventInfo") }}>Get Event Information Between Start and End Date</button></li>
      </ul>
      {event === "freeslot" && <div className='container'>
        <div className='date-picker'>
          <h1>Date Picker and Time Zones Dropdown</h1>
          <DatePicker selected={selectedDate} onChange={handleDateChange} />
        </div>
        <div className='time-zones'>
          <h1>Time Zones Dropdown</h1>
          <select value={selectedTimeZone} onChange={selectTimeZone}>
            {timeZones.map((timeZone, index) => (
              <option key={index} value={timeZone}>
                {timeZone}
              </option>
            ))}
          </select>
        </div>
        <div className='fetchbutton'>
          <button onClick={(e) => fetchFreeSlotData(e)}>Fetch Free Slots</button>
        </div>
        {timeSlots.length > 0 ?
          <div className="time-slot-container">
            {
              timeSlots.map(slot => (
                <div className="time-slot-box" key={slot} onClick={(e) => clicktimesection(slot)}>
                  <p className="time-slot-value" key={slot} >{moment.utc(slot).format('HH:mm')}</p>
                </div>
              ))
            }
          </div> : ''}
      </div>}
      {event === "createEvent" &&
        <div className='container'>
          <div className='date-picker'>
            <h1>Date Picker and Time Zones Dropdown</h1>
            <div style={{ display: "flex", alignSelf: "center" }}>
              <DatePicker selected={selectedDate} onChange={handleDateChange} />
              <input type="time" value={time} onChange={handleTimeChange} />
            </div>
          </div>
          <div className='time-zones'>
            <h1>Select duration</h1>
            <select value={duration} onChange={selectDuration}>
              <option key="30" value={30}>30</option>
              <option key="60" value={60}>60</option>
            </select>
          </div>
          <button onClick={() => createEvent()}>Create Event</button>
        </div>
      }
      {event === "eventInfo" && <div className='container'>

        Start Date: <DatePicker selected={startDate} onChange={handleStartDateChange} />
        End Date : <DatePicker selected={endDate} onChange={handleEndDateChange} />
        <button style={{marginTop:"9px"}}onClick={() => getEvents()}>Get events Between Dates</button>
        {console.log(getEvent)}
        {getEvent.length > 0 ?
          <div className="time-slot-container">
            {
              getEvent.map(slot => (
                <div className="get-event-box" key={slot}>
                  <p className="time-slot-value" key={slot} >{slot.split('T')[0]+" "+ slot.split('T')[1].split('.')[0]}</p>
                </div>
              ))
            }
          </div> : ''}
      </div>}
    </>
  );
}

export default App;
