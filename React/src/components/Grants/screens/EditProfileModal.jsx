import React, { useState, useEffect } from "react";
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  message, 
  Divider,
  Tag,
  Typography
} from "antd";
import {
  BankOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  RocketOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  PhoneOutlined,
  FileTextOutlined,
  BookOutlined,
  EditOutlined
} from "@ant-design/icons";
import axiosClient from "../../../axiosClient";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const EditProfileModal = ({ visible, onCancel, user, setUser, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const isGrantOwner = user?.investor === 2;
  const isInvestor = user?.investor === 3;

  // Common categories for both types
  const allCategories = [
    "Education", "Technology", "Sustainability", 
    "FinTech", "HealthTech", "AgriTech",
    "Renewable Energy", "E-commerce", "Logistics",
    "Agriculture", "Healthcare", "Financial Inclusion"
  ];

  useEffect(() => {
    if (visible && user) {
      // Pre-populate form with existing data
      const initialValues = {
        fname: user.fname || user.name || "",
        org_type: user.org_type || "",
        phone: user.phone || "",
        regions: user.regions || "",
        website: user.website || "",
      };

      // Add mission/bio field based on user type
      if (isGrantOwner) {
        initialValues.mission = user.mission || user.bio || "";
      } else if (isInvestor) {
        initialValues.mission = user.mission || user.bio || "";
        initialValues.startup_stage = user.startup_stage || "";
        initialValues.inv_range = user.inv_range || "";
        initialValues.eng_prefer = user.eng_prefer || "";
      }

      form.setFieldsValue(initialValues);
      setSelectedCategories(user.interested_cats || []);
      setHasChanges(false);
    }
  }, [visible, user, form, isGrantOwner, isInvestor]);

  // Track form changes
  const handleFormChange = () => {
    setHasChanges(true);
  };

  const handleCategoryChange = (e) => {
    if (e.key === "Enter" && inputValue) {
      if (!selectedCategories.includes(inputValue)) {
        setSelectedCategories([...selectedCategories, inputValue]);
        setInputValue("");
        setHasChanges(true);
      }
    }
  };

  const removeCategory = (removedTag) => {
    const newCategories = selectedCategories.filter(tag => tag !== removedTag);
    setSelectedCategories(newCategories);
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Validate required fields before submission
      if (!selectedCategories || selectedCategories.length === 0) {
        message.error('Please select at least one focus sector');
        setLoading(false);
        return;
      }

      if (!values.regions) {
        message.error('Please specify target regions');
        setLoading(false);
        return;
      }

      // Prepare the payload with validated fields
      const payload = {
        fname: values.fname || user.fname || user.name || "",
        interested_cats: Array.isArray(selectedCategories) ? selectedCategories : [],
        regions: values.regions || user.regions || "",
        // Optional fields
        org_type: values.org_type || user.org_type || "",
        phone: values.phone || user.phone || "",
        website: values.website || user.website || "",
      };

      // Add fields specific to grant owners
      if (isGrantOwner) {
        payload.mission = values.mission || user.mission || user.bio || "";
      }

      // Add fields specific to investors
      if (isInvestor) {
        payload.startup_stage = values.startup_stage || user.startup_stage || "";
        payload.inv_range = values.inv_range || user.inv_range || "";
        payload.eng_prefer = values.eng_prefer || user.eng_prefer || "";
      }

      // Determine the API endpoint based on user role
      const endpoint = isGrantOwner 
        ? '/grant/update-profile' 
        : '/capital/update-profile';

      // Make the API call
      const response = await axiosClient.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update the user context with the response data
      setUser({
        ...user,
        ...response.data.user
      });

      // Show success message
      message.success("Profile updated successfully");
      setHasChanges(false);
      onCancel();

      // If parent component provided an onUpdate callback, call it
      if (onUpdate) {
        onUpdate(response.data.user);
      }
    } catch (error) {
      console.error("Update failed:", error);
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).join('\n')
        : error.response?.data?.message || "Failed to update profile";
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Modal.confirm({
        title: 'Discard changes?',
        content: 'You have unsaved changes. Are you sure you want to close without saving?',
        onOk: () => {
          setHasChanges(false);
          onCancel();
        }
      });
    } else {
      onCancel();
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <EditOutlined />
          {`Edit ${isGrantOwner ? "Grant Organization" : "Investor"} Profile`}
        </div>
      }
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
          disabled={!hasChanges}
          className="bg-green-500 hover:bg-green-600 border-none text-white disabled:bg-gray-300"
        >
          {hasChanges ? "Save Changes" : "No Changes"}
        </Button>,
      ]}
      width={800}
      className="rounded-lg"
    >
      <div className="bg-white p-4">
        <Text type="secondary" className="block mb-4">
          💡 Only update the fields you want to change. Empty fields will keep their current values.
        </Text>

        <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
          {/* Basic Information */}
          <Divider orientation="left" className="text-gray-600">
            Basic Information
          </Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="fname"
              label="Organization Name"
              extra={user?.fname || user?.name ? `Current: ${user.fname || user.name}` : "Not set"}
            >
              <Input 
                prefix={<BankOutlined className="text-gray-400" />} 
                placeholder="Enter new organization name"
              />
            </Form.Item>

            <Form.Item
              name="org_type"
              label={isGrantOwner ? "Organization Type" : "Firm Type"}
              extra={user?.org_type ? `Current: ${user.org_type}` : "Not set"}
            >
              <Select placeholder="Select type">
                {isGrantOwner ? (
                  <>
                    <Option value="Foundation">Foundation</Option>
                    <Option value="Government Agency">Government Agency</Option>
                    <Option value="Corporate Program">Corporate Program</Option>
                    <Option value="Non-Profit">Non-Profit</Option>
                  </>
                ) : (
                  <>
                    <Option value="VC Firm">VC Firm</Option>
                    <Option value="Angel Network">Angel Network</Option>
                    <Option value="PE Firm">PE Firm</Option>
                    <Option value="Corporate VC">Corporate VC</Option>
                  </>
                )}
              </Select>
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone"
              extra={user?.phone ? `Current: ${user.phone}` : "Not set"}
            >
              <Input 
                prefix={<PhoneOutlined className="text-gray-400" />} 
                placeholder="Enter phone number"
              />
            </Form.Item>

            <Form.Item
              name="website"
              label="Website"
              extra={user?.website ? `Current: ${user.website}` : "Not set"}
              rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
            >
              <Input 
                prefix={<GlobalOutlined className="text-gray-400" />} 
                placeholder="https://example.com"
              />
            </Form.Item>

            <Form.Item
              name="regions"
              label="Operating Regions"
              extra={user?.regions ? `Current: ${user.regions}` : "Not set"}
              rules={[{ required: true, message: 'Please specify target regions' }]}
            >
              <Input 
                prefix={<EnvironmentOutlined className="text-gray-400" />} 
                placeholder="e.g., East Africa, Global"
              />
            </Form.Item>
          </div>

          {/* Mission/Bio Field - shown for both but with different labels */}
          <Form.Item
            name="mission"
            label={isGrantOwner ? "Mission Statement" : "Firm Bio"}
            extra={user?.mission || user?.bio ? "Current description set" : "Not set"}
          >
            <TextArea 
              rows={4} 
              placeholder={`Update your ${isGrantOwner ? 'mission statement' : 'firm bio'}...`}
            />
          </Form.Item>

          {/* Investor Specific Fields */}
          {isInvestor && (
            <>
              <Divider orientation="left" className="text-gray-600">
                Investment Preferences
              </Divider>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="startup_stage"
                  label="Startup Stage"
                  extra={user?.startup_stage ? `Current: ${user.startup_stage}` : "Not set"}
                >
                  <Select placeholder="Select stage" suffixIcon={<RocketOutlined className="text-gray-400" />}>
                    <Option value="Pre-seed">Pre-seed</Option>
                    <Option value="Seed">Seed</Option>
                    <Option value="Series A">Series A</Option>
                    <Option value="Series B+">Series B+</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="inv_range"
                  label="Investment Range"
                  extra={user?.inv_range ? `Current: ${user.inv_range}` : "Not set"}
                >
                  <Select placeholder="Select range" suffixIcon={<DollarOutlined className="text-gray-400" />}>
                    <Option value="$10k - $50k">$10k - $50k</Option>
                    <Option value="$50k - $250k">$50k - $250k</Option>
                    <Option value="$250k - $1M">$250k - $1M</Option>
                    <Option value="$1M+">$1M+</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="eng_prefer"
                  label="Engagement Preference"
                  extra={user?.eng_prefer ? `Current: ${user.eng_prefer}` : "Not set"}
                >
                  <Select placeholder="Select preference" suffixIcon={<FundProjectionScreenOutlined className="text-gray-400" />}>
                    <Option value="Equity">Equity</Option>
                    <Option value="Convertible Note">Convertible Note</Option>
                    <Option value="Debt">Debt</Option>
                    <Option value="Grant">Grant</Option>
                  </Select>
                </Form.Item>
              </div>
            </>
          )}

          {/* Categories Section */}
          <Divider orientation="left" className="text-gray-600">
            {isGrantOwner ? "Focus Areas" : "Investment Interests"}
          </Divider>
          <div className="mb-4">
            {user?.interested_cats?.length > 0 && (
              <div className="mb-3">
                <Text type="secondary" className="text-sm">Current categories:</Text>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.interested_cats.map((cat) => (
                    <Tag key={cat} className="bg-blue-50 text-blue-700 border-blue-200">
                      {cat}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
            
            <Text className="block mb-2 font-medium">Update Categories:</Text>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedCategories.map((category) => (
                <Tag
                  key={category}
                  closable
                  onClose={() => removeCategory(category)}
                  className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
                >
                  {category}
                </Tag>
              ))}
            </div>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Add or remove categories"
              value={selectedCategories}
              onChange={(value) => {
                setSelectedCategories(value);
                setHasChanges(true);
              }}
              dropdownRender={() => (
                <div className="p-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allCategories
                      .filter(cat => !selectedCategories.includes(cat))
                      .map(category => (
                        <div
                          key={category}
                          className="p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            if (!selectedCategories.includes(category)) {
                              setSelectedCategories([...selectedCategories, category]);
                              setHasChanges(true);
                            }
                          }}
                        >
                          {category}
                        </div>
                      ))}
                  </div>
                  <Divider className="my-2" />
                  <Input
                    prefix={<BookOutlined className="text-gray-400" />}
                    placeholder="Add custom category"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleCategoryChange}
                  />
                </div>
              )}
            />
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;