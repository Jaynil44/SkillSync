import './App.css'
import {Route, Routes, useMatch} from 'react-router-dom'
import Home from './pages/student/Home'
import CoursesList from './pages/student/CoursesList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/Student/Loading'
import Educator from './pages/Educator/Educator'
import Dashboard from './pages/Educator/Dashboard'
import AddCourse from './pages/Educator/AddCourse'
import MyCourses from './pages/Educator/MyCourses'
import StudentsEnrolled from './pages/Educator/StudentsEnrolled'
import Navbar from './components/Student/Navbar'
// import SearchBar from './components/Student/SearchBar'

function App() {
  const isEducatorPage = useMatch('/educator/*');
  return (
    <>
      {!isEducatorPage && <Navbar />}
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/course-list' element = {<CoursesList/>}/>
        <Route path='/course-list/:Id' element = {<CoursesList/>}/>
        <Route path='/course/:Id' element = {<CourseDetails/>}/>
        <Route path='/my-enrollments' element = {<MyEnrollments/>}/>
        <Route path='/player/:courseId' element = {<Player />}/>
        <Route path='/loading/:path' element = {<Loading/>}/>
        <Route path='/educator' element = {<Educator/>} >
            <Route path='educator' element ={<Dashboard/>} />
            <Route path='add-course' element={<AddCourse/>} />
            <Route path='my-courses' element={<MyCourses/>} />
            <Route path='students-enrolled' element = {<StudentsEnrolled/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
