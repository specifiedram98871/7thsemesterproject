import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";

const DeliveryPartners = () => {
  const { enqueueSnackbar } = useSnackbar();
  const backendUrl = process.env.REACT_APP_BACK_URL || "http://localhost:3000";

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    description: "",
    apiKey: "",
    apiUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch all delivery partners
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/v1/delivery-partners`);
      const data = await response.json();

      if (response.ok) {
        setPartners(data.deliveryPartners || []);
      } else {
        enqueueSnackbar(data.message || "Failed to fetch partners", {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar(err.message || "Network error", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      enqueueSnackbar("Partner name is required", { variant: "warning" });
      return;
    }

    if (!formData.logo.trim()) {
      enqueueSnackbar("Logo URL is required", { variant: "warning" });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${backendUrl}/api/v1/admin/delivery-partner/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar("Delivery partner added successfully", {
          variant: "success",
        });
        setFormData({
          name: "",
          logo: "",
          email: "",
          phoneNo: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          description: "",
          apiKey: "",
          apiUrl: "",
        });
        setOpenForm(false);
        fetchPartners();
      } else {
        enqueueSnackbar(data.message || "Failed to add partner", {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar(err.message || "Network error", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (partnerId) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/v1/admin/delivery-partner/${partnerId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar("Partner deleted successfully", {
          variant: "success",
        });
        fetchPartners();
      } else {
        enqueueSnackbar(data.message || "Failed to delete partner", {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar(err.message || "Network error", { variant: "error" });
    }
  };

  const handleToggleStatus = async (partnerId, currentStatus) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/v1/admin/delivery-partner/${partnerId}/toggle`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar(data.message || "Status updated", {
          variant: "success",
        });
        fetchPartners();
      } else {
        enqueueSnackbar(data.message || "Failed to update status", {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar(err.message || "Network error", { variant: "error" });
    }
  };

  const columns = [
    { field: "name", headerName: "Partner Name", width: 150 },
    {
      field: "logo",
      headerName: "Logo",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.name}
          className="h-8 w-8 rounded object-cover"
        />
      ),
    },
    { field: "email", headerName: "Email", width: 180 },
    { field: "phoneNo", headerName: "Phone", width: 130 },
    { field: "city", headerName: "City", width: 120 },
    {
      field: "isActive",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <button
          onClick={() => handleToggleStatus(params.row._id, params.value)}
          className={`px-3 py-1 rounded text-sm font-medium text-white transition ${
            params.value ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {params.value ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <button
          onClick={() => handleDelete(params.row._id)}
          className="text-red-600 hover:text-red-800 transition"
          title="Delete"
        >
          <DeleteIcon />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-gray-50">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Delivery Partners
            </h1>
            <p className="text-gray-600 mt-1">
              Manage delivery partners for your platform
            </p>
          </div>
          <button
            onClick={() => setOpenForm(!openForm)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <AddIcon />
            Add Partner
          </button>
        </div>

        {/* Form */}
        {openForm && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-6 border border-indigo-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add New Delivery Partner
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Swiggy, Zomato"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL *
                </label>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {formData.logo && (
                  <img
                    src={formData.logo}
                    alt="Preview"
                    className="mt-2 h-10 w-10 rounded object-cover"
                  />
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="partner@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="123456"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Partnership details, special info, etc."
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key (Optional)
                </label>
                <input
                  type="text"
                  name="apiKey"
                  value={formData.apiKey}
                  onChange={handleInputChange}
                  placeholder="API key for integration"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* API URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API URL (Optional)
                </label>
                <input
                  type="url"
                  name="apiUrl"
                  value={formData.apiUrl}
                  onChange={handleInputChange}
                  placeholder="https://api.partner.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-60"
                >
                  {submitting ? "Adding..." : "Add Partner"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* DataGrid */}
        <div className="bg-white rounded-lg shadow-md p-4" style={{ height: 500 }}>
          <DataGrid
            rows={partners}
            columns={columns}
            getRowId={(row) => row._id}
            loading={loading}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f9fafb",
                borderBottom: "2px solid #e5e7eb",
                fontWeight: "600",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartners;
