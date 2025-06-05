import React, { useState, useEffect } from "react";
import { useStateContext } from "../../../contexts/contextProvider";
import {
  Avatar,
  Badge,
  Tabs,
  Progress,
  Card,
  Tag,
  Button,
  Divider,
  Skeleton,
  Empty,
  Tooltip,
  message
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  GlobalOutlined,
  BankOutlined,
  TrophyOutlined,
  DollarOutlined,
  TeamOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  LineChartOutlined,
  ProfileOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  CameraOutlined,
  BookOutlined,
  FundProjectionScreenOutlined,
  RocketOutlined,
  HeartOutlined
} from "@ant-design/icons";
import EditProfileModal from "./EditProfileModal";
import axiosClient from "../../../axiosClient";

const { TabPane } = Tabs;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, setUser } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  console.log(user);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        message.error("File size must be less than 5MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        message.error("Only JPG/PNG/GIF files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setUser({ ...user, profilePhoto: event.target.result });
        message.success("Profile photo updated");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Check if user is grant owner (investor === 2) or capital owner/investor (investor === 3)
  const isGrantOwner = user?.investor === 2;
  const isInvestor = user?.investor === 3;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
        <Skeleton active avatar={{ size: 120, shape: "circle" }} paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!user || !user.id) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 px-4">
        <Empty 
          description="Profile not found" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Profile Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className={`h-36 relative ${isGrantOwner ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-green-600 to-blue-500'}`}></div>
        
        <div className="px-6 pb-4 relative">
          <div className="flex flex-wrap md:flex-nowrap items-start gap-6 -mt-16">
            {/* Avatar Section */}
            <div className="relative z-10">
              <Badge
                count={
                  <div
                    className="bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 shadow-sm"
                    onClick={triggerFileInput}
                  >
                    <CameraOutlined className={isGrantOwner ? "text-green-600" : "text-blue-600"} />
                  </div>
                }
                offset={[-10, 10]}
              >
                {user?.image ? (
                  <Avatar
                    size={120}
                    src={user.image}
                    className="border-4 border-white shadow-md"
                  />
                ) : user?.fname || user?.lname ? (
                  <Avatar
                    size={120}
                    src={`https://ui-avatars.com/api/?name=${
                      user.fname || ""
                    }${
                      user.lname ? `+${user.lname}` : ""
                    }&background=${isGrantOwner ? '10B981' : '2563EB'}&color=ffffff&size=128`}
                    className="border-4 border-white shadow-md"
                  />
                ) : (
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    className={`border-4 border-white shadow-md ${isGrantOwner ? 'bg-green-600' : 'bg-blue-600'}`}
                  />
                )}
              </Badge>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <div className="flex flex-1 flex-col md:flex-row justify-between items-start pt-4 md:pt-0">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  {user.name || `${user.fname} ${user.lname || ''}`}
                </h1>
                <p className="text-gray-600 mb-1">
                  {user.title || (isGrantOwner ? "Grant Organization" : "Investment Firm")}
                </p>
                {user.company && (
                  <p className={`font-medium flex items-center ${isGrantOwner ? 'text-green-600' : 'text-blue-600'}`}>
                    <BankOutlined className="mr-2" /> {user.company}
                  </p>
                )}
              </div>

              {/* Match Score and Edit Button */}
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                  <Progress
                    type="circle"
                    percent={user.matchScore || 0}
                    strokeColor={{
                      '0%': isGrantOwner ? '#10B981' : '#2563EB',
                      '100%': isGrantOwner ? '#047857' : '#1D4ED8',
                    }}
                    format={(percent) => `${percent}%`}
                    width={80}
                    trailColor="#E5E7EB"
                  />
                  <p className="font-medium text-xs text-gray-700 mt-2 text-center">
                    Profile Completeness
                  </p>
                </div>
                
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditModalVisible(true)}
                  className={`border-none text-white ${isGrantOwner ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
          
          {/* Tags Section */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {/* Grant Owner Tags */}
              {isGrantOwner && (
                <>
                  {user.org_type && (
                    <Tooltip title="Organization Type">
                      <Tag
                        icon={<BankOutlined />}
                        className="bg-green-50 text-green-600 border-green-200 px-3 py-1"
                      >
                        {user.org_type}
                      </Tag>
                    </Tooltip>
                  )}
                  {user.regions && (
                    <Tooltip title="Operating Regions">
                      <Tag
                        icon={<EnvironmentOutlined />}
                        className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1"
                      >
                        {user.regions}
                      </Tag>
                    </Tooltip>
                  )}
                  <Tooltip title="Grant Provider">
                    <Tag
                      icon={<HeartOutlined />}
                      className="bg-green-50 text-green-600 border-green-200 px-3 py-1"
                    >
                      Grant Provider
                    </Tag>
                  </Tooltip>
                </>
              )}

              {/* Investor Tags */}
              {isInvestor && (
                <>
                  {user.startup_stage && (
                    <Tooltip title="Investment Stage">
                      <Tag
                        icon={<RocketOutlined />}
                        className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-1"
                      >
                        {user.startup_stage}
                      </Tag>
                    </Tooltip>
                  )}
                  {user.inv_range && (
                    <Tooltip title="Investment Range">
                      <Tag
                        icon={<DollarOutlined />}
                        className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1"
                      >
                        {user.inv_range}
                      </Tag>
                    </Tooltip>
                  )}
                  {user.eng_prefer && (
                    <Tooltip title="Engagement Preference">
                      <Tag
                        icon={<FundProjectionScreenOutlined />}
                        className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-1"
                      >
                        {user.eng_prefer}
                      </Tag>
                    </Tooltip>
                  )}
                  <Tooltip title="Capital Provider">
                    <Tag
                      icon={<TrophyOutlined />}
                      className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-1"
                    >
                      Investor
                    </Tag>
                  </Tooltip>
                </>
              )}

              {/* Common tags */}
              {user.sector && (
                <Tooltip title="Industry Sector">
                  <Tag
                    icon={<TrophyOutlined />}
                    className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1"
                  >
                    {user.sector}
                  </Tag>
                </Tooltip>
              )}
              {user.isGenderLed && (
                <Tooltip title="Women-Led Business">
                  <Tag
                    icon={<SafetyOutlined />}
                    className="bg-purple-50 text-purple-600 border-purple-100 px-3 py-1"
                  >
                    Women-Led
                  </Tag>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="bg-white rounded-lg shadow-sm border border-gray-100"
        type="card"
      >
        <TabPane 
          tab={<span><ProfileOutlined className="mr-2" />Profile</span>} 
          key="profile"
        >
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Info Card */}
              <div className="lg:col-span-2">
                <Card
                  title={
                    <div className="flex items-center">
                      <InfoCircleOutlined className={`mr-2 ${isGrantOwner ? 'text-green-600' : 'text-blue-600'}`} />
                      Basic Information
                    </div>
                  }
                  className="shadow-sm rounded-lg border-0"
                  headStyle={{
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '12px'
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <span className="flex items-center text-gray-600 w-24 flex-shrink-0">
                          <MailOutlined className={`mr-2 ${isGrantOwner ? 'text-green-600' : 'text-blue-600'}`} /> Email:
                        </span>
                        <span className="text-gray-800">{user.email || "—"}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <span className="flex items-center text-gray-600 w-24 flex-shrink-0">
                          <PhoneOutlined className={`mr-2 ${isGrantOwner ? 'text-green-600' : 'text-blue-600'}`} /> Phone:
                        </span>
                        <span className="text-gray-800">{user.phone || "—"}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <span className="flex items-center text-gray-600 w-24 flex-shrink-0">
                          <GlobalOutlined className={`mr-2 ${isGrantOwner ? 'text-green-600' : 'text-blue-600'}`} /> Website:
                        </span>
                        <span className="text-gray-800">
                          {user.website ? (
                            <a 
                              href={user.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline"
                            >
                              {user.website}
                            </a>
                          ) : (
                            "—"
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <span className="flex items-center text-gray-600 w-24 flex-shrink-0">
                          <EnvironmentOutlined className={`mr-2 ${isGrantOwner ? 'text-green-600' : 'text-blue-600'}`} /> Location:
                        </span>
                        <span className="text-gray-800">{user.location || "—"}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Grant Owner Specific Fields */}
                      {isGrantOwner && (
                        <>
                          <div className="flex items-start">
                            <span className="flex items-center text-gray-600 w-32 flex-shrink-0">
                              <BankOutlined className="mr-2 text-green-600" /> Org Type:
                            </span>
                            <span className="text-gray-800">{user.org_type || "—"}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <span className="flex items-center text-gray-600 w-32 flex-shrink-0">
                              <EnvironmentOutlined className="mr-2 text-green-600" /> Regions:
                            </span>
                            <span className="text-gray-800">{user.regions || "—"}</span>
                          </div>
                        </>
                      )}

                      {/* Investor Specific Fields */}
                      {isInvestor && (
                        <>
                          <div className="flex items-start">
                            <span className="flex items-center text-gray-600 w-32 flex-shrink-0">
                              <RocketOutlined className="mr-2 text-blue-600" /> Startup Stage:
                            </span>
                            <span className="text-gray-800">{user.startup_stage || "—"}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <span className="flex items-center text-gray-600 w-32 flex-shrink-0">
                              <DollarOutlined className="mr-2 text-blue-600" /> Inv Range:
                            </span>
                            <span className="text-gray-800">{user.inv_range || "—"}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <span className="flex items-center text-gray-600 w-32 flex-shrink-0">
                              <FundProjectionScreenOutlined className="mr-2 text-blue-600" /> Engagement:
                            </span>
                            <span className="text-gray-800">{user.eng_prefer || "—"}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <span className="flex items-center text-gray-600 w-32 flex-shrink-0">
                              <EnvironmentOutlined className="mr-2 text-blue-600" /> Regions:
                            </span>
                            <span className="text-gray-800">{user.regions || "—"}</span>
                          </div>
                        </>
                      )}

                      {user.teamSize && (
                        <div className="flex items-start">
                          <span className="flex items-center text-gray-600 w-32 flex-shrink-0">
                            <TeamOutlined className={`mr-2 ${isGrantOwner ? 'text-green-600' : 'text-blue-600'}`} /> Team Size:
                          </span>
                          <span className="text-gray-800">{user.teamSize}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Divider className="my-4" />
                  
                  {/* Mission/Bio Section */}
                  <div>
                    <span className="flex items-center text-gray-600 mb-2">
                      <FileTextOutlined className={`mr-2 ${isGrantOwner ? 'text-green-600' : 'text-blue-600'}`} /> 
                      {isGrantOwner ? 'Mission:' : 'Bio:'}
                    </span>
                    <p className="text-gray-800">
                      {isGrantOwner ? (user.mission || user.bio || "No mission statement available.") : (user.bio || "No bio available.")}
                    </p>
                  </div>

                  {/* Interested Categories */}
                  {user.interested_cats && user.interested_cats.length > 0 && (
                    <>
                      <Divider className="my-4" />
                      <div>
                        <span className="flex items-center text-gray-600 mb-3">
                          <BookOutlined className={`mr-2 ${isGrantOwner ? 'text-green-600' : 'text-blue-600'}`} /> 
                          {isGrantOwner ? 'Focus Areas:' : 'Investment Interests:'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {user.interested_cats.map((category, index) => (
                            <Tag 
                              key={index}
                              className={`px-3 py-1 ${
                                isGrantOwner 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {category}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </div>
              
              {/* Stats Card */}
              <div className="lg:col-span-1">
                <Card
                  title={
                    <div className="flex items-center">
                      <LineChartOutlined className={`mr-2 ${isGrantOwner ? 'text-green-600' : 'text-blue-600'}`} />
                      Statistics
                    </div>
                  }
                  className="shadow-sm rounded-lg border-0"
                  headStyle={{
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '12px'
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600 text-sm">Profile Completion</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <Progress 
                        percent={85} 
                        showInfo={false} 
                        strokeColor={isGrantOwner ? "#10B981" : "#2563EB"}
                        trailColor="#E5E7EB"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600 text-sm">User Type</span>
                        <span className="font-medium">
                          {isGrantOwner ? 'Grant Provider' : 'Investor'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600 text-sm">Last Updated</span>
                        <span className="font-medium">2 days ago</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        user={user}
        setUser={setUser}
      />
    </div>
  );
};

export default ProfilePage;