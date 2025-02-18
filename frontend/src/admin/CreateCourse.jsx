import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // ✅ Import axios
import { ToastContainer , toast } from 'react-toastify'; // ✅ Import toast for notifications



function CreateCourse() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    console.log('reader is : ',reader)
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    const admin = JSON.parse(localStorage.getItem('admin')) || {};  // ✅ Handle null case
    const token = admin?.token;


    if (!token) {
      toast.error('Please login first', { autoClose: 1000 });
      setTimeout(() => navigate('/admin/signin'), 2000); // ✅ Correct timeout
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:2002/api/v1/courses/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log('New course is created:', response);
      toast.success('Course successfully created', { autoClose: 1000 });

      // ✅ Reset form fields
      setTitle('');
      setDescription('');
      setPrice('');
      setImage('');
      setImagePreview('');

      setTimeout(() => navigate('/admin/our-courses'), 2000);
    } catch (error) {
      console.error('Error at create course:', error);
      toast.error('Error at create course', { autoClose: 1000 });
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    }
  };

  return (
    <>
    <ToastContainer/>
      <form
        onSubmit={formSubmitHandler} // ✅ Attach onSubmit to the form
        className="w-full h-screen border-2 border-red-500 flex justify-center items-center"
      >
        <div className="w-1/2 h-[90%] border-2 border-gray-400 p-4 rounded-md shadow-lg shadow-gray-500">
          <div className="w-full text-center font-extrabold text-black text-2xl">
            <h1>Create Course</h1>
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
              src={imagePreview ? `${imagePreview}` : '/imgPL.webp'} // ✅ Use correct default image format
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
              className="bg-blue-600 text-white border-2 border-gray-500 w-full p-2 rounded-md
              hover:bg-green-600 transition duration-300
              "
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default CreateCourse;
