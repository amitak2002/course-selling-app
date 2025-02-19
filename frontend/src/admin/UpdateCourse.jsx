import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BACKEND_URL } from '../assets/backendurl.js';


function UpdateCourse() {

  const navigate = useNavigate();
  const { courseId } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/courses/${courseId}`,
          { withCredentials: true }
        );
         
        // checkk kre agr error ho to
        console.log('original data:', data);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setImagePreview(data?.image?.url || ""); // Use optional chaining
      } catch (error) {
        console.log('Error fetching course details:', error);
        toast.error('Error fetching course details');
      }
      setLoading(false);
    };

    fetchCourseDetails();
  }, [courseId]);

  console.log(title , description , price , image , imagePreview)

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const admin = JSON.parse(localStorage.getItem('admin'));
    const token = admin?.token;

    if (!token) {
      console.log('please login first')
      toast.error('plese login first');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/courses/update/${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        }
      );
      setImage(response.data.course.image.url)
      console.log('Course updated:', response);
      toast.success('Course successfully updated', { autoClose: 1000 });
      setTitle("")
      setDescription("")
      setPrice("")
      setImage("")
      setImagePreview("")

      // ✅ Reset form fields
      setTimeout(() => navigate('/admin/our-courses'), 2000);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error.response.data.errors, { autoClose: 1000 });
    }
  };

  if (loading) {
    return <p className='font-extrabold text-2xl flex justify-center items-center'>Loading...</p>
  }

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleUpdateCourse}
        className="w-full h-screen flex justify-center items-center"
      >
        <div className="w-1/2 h-[90%] border-2 border-gray-400 p-4 rounded-md shadow-lg shadow-gray-500">
          <div className="w-full text-center font-extrabold text-black text-2xl">
            <h1>Update Course</h1>
          </div>

          <div className="w-full my-4 text-black font-bold">
            <h1 className="text-xl p-2">Title</h1>
            <input
              type="text"
              placeholder="Enter your course title"
              className="border-2 border-gray-500 w-full p-2 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="w-full my-4 text-black font-bold">
            <h1 className="text-xl p-2">Description</h1>
            <input
              type="text"
              placeholder="Enter your course description"
              className="border-2 border-gray-500 w-full p-2 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="w-full my-4 text-black font-bold">
            <h1 className="text-xl p-2">Price</h1>
            <input
              type="text"
              placeholder="Enter your course price"
              className="border-2 border-gray-500 w-full p-2 rounded-md"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="w-full my-4 text-black font-bold">
            <label>Course Image</label>
            <img
              src={imagePreview ? `${imagePreview}` : "/imgPL.web"}
              className="w-[10%] h-[35px]"
              alt="Course"
            />
          </div>

          <div className="w-full my-4 text-black font-bold">
            <h1 className="text-xl p-2">Course Image (PNG, JPEG)</h1>
            <input
              type="file"
              onChange={changePhotoHandler}
              className="border-2 border-gray-500 w-full p-2 rounded-md"
              accept="image/png, image/jpeg"
            />
          </div>

          <div className="w-full my-6 text-black font-bold">
            <button
              type="submit"
              className="bg-blue-600 text-white border-2 border-gray-500 w-full p-2 rounded-md"
            >
              Update Course
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default UpdateCourse;
