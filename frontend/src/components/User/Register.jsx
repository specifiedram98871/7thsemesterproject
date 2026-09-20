import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, registerUser } from "../../actions/userAction";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";
import FormSidebar from "./FormSidebar";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    cpassword: "",
  });

  const { name, email, gender, password, cpassword } = user;

  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("preview.png");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateRegister = () => {
    const errors = {};
    const normalizedEmail = email.trim();

    if (!name.trim()) errors.name = "Full name is required";
    if (!normalizedEmail) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      errors.email = "Enter a valid email address";
    }
    if (!gender) errors.gender = "Select your gender";
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!cpassword) {
      errors.cpassword = "Confirm your password";
    } else if (password !== cpassword) {
      errors.cpassword = "Passwords do not match";
    }
    if (!avatar) errors.avatar = "Choose an avatar";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email.trim());
    formData.set("gender", gender);
    formData.set("password", password);
    formData.set("avatar", avatar);

    dispatch(registerUser(formData));
  };

  const handleDataChange = (e) => {
    if (e.target.name === "avatar") {
      if (!e.target.files[0]) return;
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
          setFieldErrors((errors) => ({ ...errors, avatar: "" }));
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
      setFieldErrors((errors) => ({ ...errors, [e.target.name]: "" }));
    }
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate("/");
    }
  }, [dispatch, error, isAuthenticated, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Register | ShopEase" />

      {loading && <BackdropLoader />}
      <main className="w-full mt-12 sm:pt-20 sm:mt-0">
        {/* <!-- row --> */}
        <div className="flex sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg">
          <FormSidebar
            title="Looks like you're new here!"
            tag="Sign up with your mobile number to get started"
          />

          {/* <!-- signup column --> */}
          <div className="flex-1 overflow-hidden">
            {/* <!-- personal info procedure container --> */}
            <form
              onSubmit={handleRegister}
              encType="multipart/form-data"
              noValidate
              className="p-5 sm:p-10"
            >
              <div className="flex flex-col gap-4 items-start">
                {/* <!-- input container column --> */}
                <div className="flex flex-col w-full justify-between sm:flex-col gap-3 items-center">
                  <TextField
                    fullWidth
                    id="full-name"
                    label="Full Name"
                    name="name"
                    value={name}
                    onChange={handleDataChange}
                    error={Boolean(fieldErrors.name)}
                    helperText={fieldErrors.name}
                  />
                  <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleDataChange}
                    error={Boolean(fieldErrors.email)}
                    helperText={fieldErrors.email}
                  />
                </div>
                {/* <!-- input container column --> */}

                {/* <!-- gender input --> */}
                <div className="flex gap-4 items-center">
                  <h2 className="text-md">Your Gender :</h2>
                  <div className="flex flex-col items-start gap-1" id="radioInput">
                    <RadioGroup
                      row
                      aria-labelledby="radio-buttons-group-label"
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        name="gender"
                        value="male"
                        onChange={handleDataChange}
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        name="gender"
                        value="female"
                        onChange={handleDataChange}
                        control={<Radio />}
                        label="Female"
                      />
                    </RadioGroup>
                    {fieldErrors.gender && <FormHelperText error>{fieldErrors.gender}</FormHelperText>}
                  </div>
                </div>
                {/* <!-- gender input --> */}

                {/* <!-- input container column --> */}
                <div className="flex flex-col w-full justify-between sm:flex-row gap-3 items-center">
                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleDataChange}
                    error={Boolean(fieldErrors.password)}
                    helperText={fieldErrors.password}
                  />
                  <TextField
                    id="confirm-password"
                    label="Confirm Password"
                    type="password"
                    name="cpassword"
                    value={cpassword}
                    onChange={handleDataChange}
                    error={Boolean(fieldErrors.cpassword)}
                    helperText={fieldErrors.cpassword}
                  />
                </div>
                {/* <!-- input container column --> */}

                <div className="flex flex-col w-full justify-between sm:flex-row gap-3 items-center">
                  <Avatar
                    alt="Avatar Preview"
                    src={avatarPreview}
                    sx={{ width: 56, height: 56 }}
                  />
                  <label className={`rounded font-medium text-center cursor-pointer text-white w-full py-2 px-2.5 shadow hover:shadow-lg ${fieldErrors.avatar ? "bg-red-500" : "bg-gray-400"}`}>
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={handleDataChange}
                      className="hidden"
                    />
                    Choose File
                  </label>
                  {fieldErrors.avatar && <FormHelperText error>{fieldErrors.avatar}</FormHelperText>}
                </div>
                <button
                  type="submit"
                  className="text-white py-3 w-full bg-primary-buttonGreen shadow hover:shadow-lg rounded-sm font-medium"
                >
                  Signup
                </button>
                <Link
                  to="/login"
                  className="hover:bg-gray-50 text-primary-green text-center py-3 w-full shadow border rounded-sm font-medium"
                >
                  Existing User? Log in
                </Link>
              </div>
            </form>
            {/* <!-- personal info procedure container --> */}
          </div>
          {/* <!-- signup column --> */}
        </div>
        {/* <!-- row --> */}
      </main>
    </>
  );
};

export default Register;
