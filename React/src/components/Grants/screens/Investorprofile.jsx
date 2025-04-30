import React, { useState, useRef, useEffect } from "react";
import { useStateContext } from "../../../contexts/contextProvider";
import {
  Avatar,
  Badge,
  Tabs,
  Progress,
  Card,
  Tag,
  Button,
  Input,
  Upload,
  message,
  Form,
  Select,
  Divider,
  Empty,
  Table,
  Tooltip,
  Space,
  Skeleton
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
  FilePdfOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileOutlined,
  UploadOutlined,
  CameraOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  LineChartOutlined,
  ProfileOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import axiosClient from "../../../axiosClient";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, setUser } = useStateContext();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [grantData, setGrantData] = useState([]);
  const [investmentData, setInvestmentData] = useState([]);

  // Document data
  const [documents, setDocuments] = useState([
    { id: 1, name: "Business Plan", type: "pdf", status: "complete", date: "2025-04-10" },
    { id: 2, name: "Financial Projections", type: "excel", status: "complete", date: "2025-04-08" },
    { id: 3, name: "Pitch Video", type: "video", status: "complete", date: "2025-04-05" },
    { id: 4, name: "Team CVs", type: "doc", status: "partial", date: "2025-04-12" },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get("/checkAuth");
        
        // Ensure we have valid user data before proceeding
        if (!data?.user) {
          message.error("Invalid user data received");
          setLoading(false);
          return;
        }
        
        // Fetch grants or investments data based on investor type
        if (data.user.investor === 2) {
          // For grant providers
          try {
            const grantResponse = await axiosClient.get("/grants");
            setGrantData(grantResponse.data || []);
          } catch (grantError) {
            console.error("Error fetching grants:", grantError);
            message.error("Failed to load grant data");
            // Fallback data only for grants, not replacing user
            setGrantData([
              {
                id: 6,
                grant_title: "Example Grant",
                total_grant_amount: "100,000",
                funding_per_business: "30,000",
                eligibility_criteria: "test",
                required_documents: "Tax Compliance",
                application_deadline: "2025-04-11",
                grant_focus: "Technology",
                startup_stage_focus: "Seed",
                impact_objectives: "Empowering tech startups",
                evaluation_criteria: "Innovation, Team Experience, Market Potential",
                visible: 1,
                regions: ["Africa", "Global"],
                pitch_count: 5
              }
            ]);
          }
        } else if (data.user.investor === 3) {
          // For investors
          try {
            const investmentResponse = await axiosClient.get("/capitals");
            setInvestmentData(investmentResponse.data || []);
          } catch (investError) {
            console.error("Error fetching investments:", investError);
            message.error("Failed to load investment data");
            // Fallback data only for investments, not replacing user
            setInvestmentData([
              {
                id: 25,
                offer_title: "Example Investment",
                total_capital_available: "2000.00",
                per_startup_allocation: "3000.00",
                milestone_requirements: "Product market fit, Revenue milestones",
                startup_stage: "Seed",
                sectors: "Fintech,SaaS",
                regions: "Latin America,Global",
                required_docs: "Pitch Deck,Financial Projections",
                visible: 1,
                pitch_count: 3
              }
            ]);
          }
        }
        
        // Enhance user data with defaults for missing fields but preserve identity
        const enhancedUser = {
          ...data.user,
          name: `${data.user.fname || ''} ${data.user.lname || ''}`.trim(),
          // Default values for missing fields
          title: data.user.title || (data.user.investor === 2 ? "Grant Manager" : data.user.investor === 3 ? "Investment Manager" : "Member"),
          company: data.user.company || (data.user.investor === 2 ? "Grant Foundation" : data.user.investor === 3 ? "Venture Capital Firm" : ""),
          sector: data.user.sector || "Technology",
          location: data.user.location || "Nairobi, Kenya",
          website: data.user.website || "",
          bio: data.user.bio || "Professional with experience in the technology sector.",
          matchScore: data.user.matchScore || 85,
          fundingType: data.user.fundingType || (data.user.investor === 2 ? "Grant" : "Equity"),
          stage: data.user.stage || "Growth Stage",
          teamSize: data.user.teamSize || 4,
          yearsExperience: data.user.yearsExperience || 5,
          // Features
          isGenderLed: !!data.user.isGenderLed,
          isYouthLed: !!data.user.isYouthLed,
          isRuralBased: !!data.user.isRuralBased,
          usesLocalSourcing: !!data.user.usesLocalSourcing,
        };
        
        setUser(enhancedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        message.error("Failed to load profile data");
        
        if (!user || !user.id) {
          console.log("No user found in context, user may need to log in");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Toggle edit mode
  const toggleEdit = () => {
    if (editing) {
      form.validateFields()
        .then((values) => {
          setUser({ ...user, ...values });
          setEditing(false);
          message.success("Profile updated successfully");
        })
        .catch((info) => {
          console.log("Validate Failed:", info);
        });
    } else {
      form.setFieldsValue(user);
      setEditing(true);
    }
  };

  // Handle photo upload
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

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle document upload
  const handleDocumentUpload = (info) => {
    const { status } = info.file;
    if (status !== "uploading") {
      setUploading(true);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
      setUploading(false);
      
      // Get current date
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      
      // Add the new document to the list
      setDocuments([
        ...documents,
        {
          id: documents.length + 1,
          name: info.file.name,
          type: info.file.type.split("/")[1] || "file",
          status: "complete",
          date: dateStr
        },
      ]);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      setUploading(false);
    }
  };

  // Get appropriate icon for file type
  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FilePdfOutlined className="text-red-500" />;
      case "excel":
        return <FileExcelOutlined className="text-green-600" />;
      case "doc":
      case "docx":
        return <FileWordOutlined className="text-blue-500" />;
      case "image":
      case "jpg":
      case "png":
        return <FileImageOutlined className="text-purple-500" />;
      case "video":
        return <FileOutlined className="text-orange-500" />;
      default:
        return <FileOutlined className="text-gray-500" />;
    }
  };

  // Get status tag for document
  const getStatusTag = (status) => {
    switch (status) {
      case "complete":
        return (
          <Tag icon={<CheckCircleOutlined />} className="bg-green-50 text-green-600 border-green-100">
            Complete
          </Tag>
        );
      case "partial":
        return (
          <Tag icon={<ClockCircleOutlined />} className="bg-orange-50 text-orange-600 border-orange-100">
            In Progress
          </Tag>
        );
      default:
        return (
          <Tag className="bg-gray-50 text-gray-600 border-gray-200">
            Pending
          </Tag>
        );
    }
  };

  // Options for form selects
  const fundingTypes = ["Equity", "Grant", "Debt", "Convertible Note", "Equity & Grants"];
  const stages = ["Idea Stage", "Pre-Seed", "Seed Stage", "Growth Stage", "Scale Stage"];
  const sectors = ["Technology", "Finance", "Healthcare", "Agriculture", "Energy", "Education", "Retail", "Manufacturing"];

  // Get funding progress data based on user type
  const getFundingData = () => {
    if (user?.investor === 2) {
      // Grant provider data
      return grantData.map(grant => ({
        id: grant.id,
        title: grant.grant_title,
        amount: `$${grant.total_grant_amount || 0}`,
        perBusiness: `$${grant.funding_per_business || 0}`,
        focus: grant.grant_focus || "Various",
        stage: grant.startup_stage_focus || "All Stages",
        deadline: grant.application_deadline || "Open",
        applications: grant.pitch_count || 0,
        progress: Math.min(100, ((grant.pitch_count || 0) / 10) * 100), // Example calculation
        status: "Active"
      }));
    } else if (user?.investor === 3) {
      // Investor data
      return investmentData.map(investment => ({
        id: investment.id,
        title: investment.offer_title,
        amount: `$${investment.total_capital_available || 0}`,
        perStartup: `$${investment.per_startup_allocation || 0}`,
        sectors: investment.sectors ? investment.sectors.split(',') : [],
        stage: investment.startup_stage || "All Stages",
        regions: investment.regions ? investment.regions.split(',') : [],
        applications: investment.pitch_count || 0,
        progress: Math.min(100, ((investment.pitch_count || 0) / 5) * 100), // Example calculation
        status: "Active"
      }));
    }
    
    // Default/fallback data
    return [];
  };

  // Render document cards
  const renderDocumentCards = () => {
    return documents.map((doc) => (
      <div
        key={doc.id}
        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <div className="text-3xl mr-4">
          {getFileIcon(doc.type)}
        </div>
        <div className="flex-1">
          <span className="font-medium text-gray-700 mb-1 block">
            {doc.name}
          </span>
          <div className="flex items-center justify-between">
            {getStatusTag(doc.status)}
            <span className="text-xs text-gray-500">{doc.date}</span>
          </div>
        </div>
      </div>
    ));
  };

  // If we're still loading or have no user data, show a loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
        <Skeleton active avatar={{ size: 120, shape: "circle" }} paragraph={{ rows: 6 }} />
        <div className="mt-6">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }
  
  // If after loading there's still no user, show an error state
  if (!user || !user.id) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 px-4">
        <svg
          className="w-20 h-20 text-gray-400 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-xl text-gray-800 font-medium mb-2">Profile Unavailable</h2>
        <p className="text-gray-500 text-center max-w-md mb-6">
          We couldn't retrieve your profile information. Please try again or contact support.
        </p>
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          onClick={() => window.location.href = "/login"}
        >
          Return to Login
        </button>
      </div>
    );
  }

  // Calculate funding content
  const fundingData = getFundingData();
  
  // Columns for funding table
  const fundingColumns = user.investor === 2 
    ? [
        {
          title: 'Grant Name',
          dataIndex: 'title',
          key: 'title',
          render: (text) => <span className="font-medium">{text}</span>
        },
        {
          title: 'Sector Focus',
          dataIndex: 'focus',
          key: 'focus',
        },
        {
          title: 'Total Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Per Business',
          dataIndex: 'perBusiness',
          key: 'perBusiness',
        },
        {
          title: 'Deadline',
          dataIndex: 'deadline',
          key: 'deadline',
        },
        {
          title: 'Applications',
          dataIndex: 'applications',
          key: 'applications',
        },
        {
          title: 'Progress',
          dataIndex: 'progress',
          key: 'progress',
          render: (percent) => (
            <Progress percent={percent} strokeColor="#10B981" trailColor="#E5E7EB" />
          )
        }
      ]
    : [
        {
          title: 'Investment Name',
          dataIndex: 'title',
          key: 'title',
          render: (text) => <span className="font-medium">{text}</span>
        },
        {
          title: 'Sectors',
          dataIndex: 'sectors',
          key: 'sectors',
          render: (sectors) => (
            <div className="flex flex-wrap gap-1">
              {sectors.map(sector => (
                <Tag key={sector} className="bg-gray-100 text-gray-700 border-gray-200">{sector}</Tag>
              ))}
            </div>
          )
        },
        {
          title: 'Total Capital',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Per Startup',
          dataIndex: 'perStartup',
          key: 'perStartup',
        },
        {
          title: 'Applications',
          dataIndex: 'applications',
          key: 'applications',
        },
        {
          title: 'Progress',
          dataIndex: 'progress',
          key: 'progress',
          render: (percent) => (
            <Progress percent={percent} strokeColor="#10B981" trailColor="#E5E7EB" />
          )
        }
      ];

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Profile Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden">
        {/* Header background with gradient */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 h-36 relative"></div>
        
        <div className="px-6 pb-4 relative">
          {/* Profile Image and Basic Info */}
          <div className="flex flex-wrap md:flex-nowrap items-start gap-6 -mt-16">
            {/* Avatar Section */}
            <div className="relative z-10">
              <Badge
                count={
                  <div
                    className="bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 shadow-sm"
                    onClick={triggerFileInput}
                  >
                    <CameraOutlined className="text-green-600" />
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
                    }&background=10B981&color=ffffff&size=128`}
                    className="border-4 border-white shadow-md"
                  />
                ) : (
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    className="bg-green-600 border-4 border-white shadow-md"
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
                {editing ? (
                  <Form form={form} layout="vertical" className="w-full">
                    <Form.Item
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your name!",
                        },
                      ]}
                    >
                      <Input className="text-2xl font-semibold text-gray-900" />
                    </Form.Item>
                    <Form.Item name="title">
                      <Input className="text-gray-600" />
                    </Form.Item>
                    <Form.Item name="company">
                      <Input
                        prefix={<BankOutlined />}
                        className="text-green-600 font-medium"
                      />
                    </Form.Item>
                  </Form>
                ) : (
                  <>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                      {user.name}
                    </h1>
                    <p className="text-gray-600 mb-1">
                      {user.title}
                    </p>
                    {user.company && (
                      <p className="text-green-600 font-medium flex items-center">
                        <BankOutlined className="mr-2" /> {user.company}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Match Score */}
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                  <Progress
                    type="circle"
                    percent={user.matchScore || 0}
                    strokeColor={{
                      '0%': '#10B981',
                      '100%': '#047857',
                    }}
                    format={(percent) => `${percent}%`}
                    width={80}
                    trailColor="#E5E7EB"
                  />
                  <p className="font-medium text-xs text-gray-700 mt-2 text-center">
                    {user.investor === 2 ? "Grant Match" : "Investment Match"}
                  </p>
                </div>
                
                {/* Edit Button */}
                <Button
                  type={editing ? "default" : "primary"}
                  icon={editing ? <SaveOutlined /> : <EditOutlined />}
                  onClick={toggleEdit}
                  className={
                    editing
                      ? "border-gray-300 hover:border-green-500 hover:text-green-600"
                      : "bg-green-600 hover:bg-green-700 border-green-600 text-white"
                  }
                >
                  {editing ? "Save" : "Edit"}
                </Button>
                {editing && (
                  <Button
                    icon={<CloseOutlined />}
                    onClick={() => setEditing(false)}
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Tags Section */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {editing ? (
                <>
                  <Form.Item name="sector" className="m-0">
                    <Select
                      style={{ width: 180 }}
                      placeholder="Select Sector"
                    >
                      {sectors.map((sector) => (
                        <Option key={sector} value={sector}>
                          {sector}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="fundingType" className="m-0">
                    <Select
                      style={{ width: 180 }}
                      placeholder="Funding Type"
                    >
                      {fundingTypes.map((type) => (
                        <Option key={type} value={type}>
                          {type}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="stage" className="m-0">
                    <Select
                      style={{ width: 180 }}
                      placeholder="Business Stage"
                    >
                      {stages.map((stage) => (
                        <Option key={stage} value={stage}>
                          {stage}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              ) : (
                <>
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
                  {user.fundingType && (
                    <Tooltip title="Funding Type">
                      <Tag
                        icon={<DollarOutlined />}
                        className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1"
                      >
                        {user.fundingType}
                      </Tag>
                    </Tooltip>
                  )}
                  {user.stage && (
                    <Tooltip title="Business Stage">
                      <Tag
                        icon={<LineChartOutlined />}
                        className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1"
                      >
                        {user.stage}
                      </Tag>
                    </Tooltip>
                  )}
                  {user.isGenderLed && (
                    <Tooltip title="Women-Led Business">
                      <Tag
                        icon={<SafetyOutlined />}
                        className="bg-green-50 text-green-600 border-green-100 px-3 py-1"
                      >
                        Women-Led
                      </Tag>
                    </Tooltip>
                  )}
                  {user.isYouthLed && (
                    <Tooltip title="Youth-Led Business">
                      <Tag
                        icon={<SafetyOutlined />}
                        className="bg-green-50 text-green-600 border-green-100 px-3 py-1"
                      >
                        Youth-Led
                      </Tag>
                    </Tooltip>
                  )}
                  {user.isRuralBased && (
                    <Tooltip title="Rural-Based Business">
                      <Tag
                        icon={<EnvironmentOutlined />}
                        className="bg-green-50 text-green-600 border-green-100 px-3 py-1"
                      >
                        Rural-Based
                      </Tag>
                    </Tooltip>
                  )}
                  {user.usesLocalSourcing && (
                    <Tooltip title="Uses Local Resources">
                      <Tag
                        icon={<SafetyOutlined />}
                        className="bg-green-50 text-green-600 border-green-100 px-3 py-1"
                      >
                        Local Sourcing
                      </Tag>
                    </Tooltip>
                  )}
                </>
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
        {/* Profile Tab */}
        <TabPane 
          tab={<span><ProfileOutlined className="mr-2" />Profile</span>} 
          key="profile"
        >
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Info Card */}
              <div className="lg:col-span-2">
                <Card
                  title={<div className="flex items-center"><InfoCircleOutlined className="mr-2 text-green-600" />Basic Information</div>}
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
                          <MailOutlined className="mr-2 text-green-600" /> Email:
                        </span>
                        {editing ? (
                          <Form.Item
                            name="email"
                            rules={[
                              {
                                type: "email",
                                message: "Please enter a valid email!",
                              },
                            ]}
                            className="mb-0 flex-1"
                          >
                            <Input />
                          </Form.Item>
                        ) : (
                          <span className="text-gray-800">{user.email}</span>
                        )}
                      </div>
                      
                      <div className="flex items-start">
                        <span className="flex items-center text-gray-600 w-24 flex-shrink-0">
                          <PhoneOutlined className="mr-2 text-green-600" /> Phone:
                        </span>
                        {editing ? (
                          <Form.Item name="phone" className="mb-0 flex-1">
                            <Input />
                          </Form.Item>
                        ) : (
                          <span className="text-gray-800">{user.phone || "—"}</span>
                        )}
                        </div>
                      
                      <div className="flex items-start">
                        <span className="flex items-center text-gray-600 w-24 flex-shrink-0">
                          <GlobalOutlined className="mr-2 text-green-600" /> Website:
                        </span>
                        {editing ? (
                          <Form.Item name="website" className="mb-0 flex-1">
                            <Input />
                          </Form.Item>
                        ) : (
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
                        )}
                      </div>
                      
                      <div className="flex items-start">
                        <span className="flex items-center text-gray-600 w-24 flex-shrink-0">
                          <TeamOutlined className="mr-2 text-green-600" /> Team Size:
                        </span>
                        {editing ? (
                          <Form.Item name="teamSize" className="mb-0 flex-1">
                            <Input type="number" min={1} />
                          </Form.Item>
                        ) : (
                          <span className="text-gray-800">{user.teamSize || "—"}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <span className="flex items-center text-gray-600 w-24 flex-shrink-0">
                          <EnvironmentOutlined className="mr-2 text-green-600" /> Location:
                        </span>
                        {editing ? (
                          <Form.Item name="location" className="mb-0 flex-1">
                            <Input />
                          </Form.Item>
                        ) : (
                          <span className="text-gray-800">{user.location || "—"}</span>
                        )}
                      </div>
                      
                      <div className="flex items-start">
                        <span className="flex items-center text-gray-600 w-24 flex-shrink-0">
                          <CalendarOutlined className="mr-2 text-green-600" /> Experience:
                        </span>
                        {editing ? (
                          <Form.Item name="yearsExperience" className="mb-0 flex-1">
                            <Input type="number" min={0} />
                          </Form.Item>
                        ) : (
                          <span className="text-gray-800">
                            {user.yearsExperience ? `${user.yearsExperience} years` : "—"}
                          </span>
                        )}
                      </div>
                      
                      {user.investor !== 2 && user.investor !== 3 && (
                        <div className="flex items-start">
                          <span className="flex items-center text-gray-600 w-24 flex-shrink-0">
                            <FileTextOutlined className="mr-2 text-green-600" /> Status:
                          </span>
                          {editing ? (
                            <Form.Item name="status" className="mb-0 flex-1">
                              <Select defaultValue="Active">
                                <Option value="Active">Active</Option>
                                <Option value="Seeking Funding">Seeking Funding</Option>
                                <Option value="Recently Funded">Recently Funded</Option>
                              </Select>
                            </Form.Item>
                          ) : (
                            <span className="text-gray-800">
                              <Tag color="green">Active</Tag>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Divider className="my-4" />
                  
                  <div>
                    <span className="flex items-center text-gray-600 mb-2">
                      <FileTextOutlined className="mr-2 text-green-600" /> Bio:
                    </span>
                    {editing ? (
                      <Form.Item name="bio" className="mb-0">
                        <TextArea rows={4} />
                      </Form.Item>
                    ) : (
                      <p className="text-gray-800">{user.bio || "No bio available."}</p>
                    )}
                  </div>
                </Card>
              </div>
              
              {/* Stats Card */}
              <div className="lg:col-span-1">
                <Card
                  title={<div className="flex items-center"><LineChartOutlined className="mr-2 text-green-600" />Statistics</div>}
                  className="shadow-sm rounded-lg border-0"
                  headStyle={{
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '12px'
                  }}
                >
                  {user.investor === 2 ? (
                    // Grant provider stats
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600 text-sm">Total Grants</span>
                          <span className="font-medium">{grantData.length || 0}</span>
                        </div>
                        <Progress 
                          percent={Math.min(100, (grantData.length / 5) * 100)} 
                          showInfo={false} 
                          strokeColor="#10B981" 
                          trailColor="#E5E7EB"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600 text-sm">Applications</span>
                          <span className="font-medium">
                            {grantData.reduce((acc, grant) => acc + (grant.pitch_count || 0), 0)}
                          </span>
                        </div>
                        <Progress 
                          percent={Math.min(100, (grantData.reduce((acc, grant) => acc + (grant.pitch_count || 0), 0) / 15) * 100)} 
                          showInfo={false} 
                          strokeColor="#10B981" 
                          trailColor="#E5E7EB"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600 text-sm">Profile Completion</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress 
                          percent={85} 
                          showInfo={false} 
                          strokeColor="#10B981" 
                          trailColor="#E5E7EB"
                        />
                      </div>
                    </div>
                  ) : user.investor === 3 ? (
                    // Investor stats
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600 text-sm">Investments</span>
                          <span className="font-medium">{investmentData.length || 0}</span>
                        </div>
                        <Progress 
                          percent={Math.min(100, (investmentData.length / 5) * 100)} 
                          showInfo={false} 
                          strokeColor="#10B981" 
                          trailColor="#E5E7EB"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600 text-sm">Applications</span>
                          <span className="font-medium">
                            {investmentData.reduce((acc, investment) => acc + (investment.pitch_count || 0), 0)}
                          </span>
                        </div>
                        <Progress 
                          percent={Math.min(100, (investmentData.reduce((acc, investment) => acc + (investment.pitch_count || 0), 0) / 15) * 100)} 
                          showInfo={false} 
                          strokeColor="#10B981" 
                          trailColor="#E5E7EB"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600 text-sm">Profile Completion</span>
                          <span className="font-medium">90%</span>
                        </div>
                        <Progress 
                          percent={90} 
                          showInfo={false} 
                          strokeColor="#10B981" 
                          trailColor="#E5E7EB"
                        />
                      </div>
                    </div>
                  ) : (
                    // Entrepreneur stats
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600 text-sm">Applications</span>
                          <span className="font-medium">5</span>
                        </div>
                        <Progress 
                          percent={50} 
                          showInfo={false} 
                          strokeColor="#10B981" 
                          trailColor="#E5E7EB"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600 text-sm">Matches</span>
                          <span className="font-medium">3</span>
                        </div>
                        <Progress 
                          percent={60} 
                          showInfo={false} 
                          strokeColor="#10B981" 
                          trailColor="#E5E7EB"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600 text-sm">Profile Completion</span>
                          <span className="font-medium">75%</span>
                        </div>
                        <Progress 
                          percent={75} 
                          showInfo={false} 
                          strokeColor="#10B981" 
                          trailColor="#E5E7EB"
                        />
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </TabPane>
        
        {/* Documents Tab */}
        <TabPane 
          tab={<span><FileOutlined className="mr-2" />Documents</span>} 
          key="documents"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Your Documents</h3>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                onChange={handleDocumentUpload}
                showUploadList={false}
              >
                <Button 
                  type="primary" 
                  icon={<UploadOutlined />} 
                  loading={uploading}
                  className="bg-green-600 hover:bg-green-700 border-green-600 text-white"
                >
                  Upload Document
                </Button>
              </Upload>
            </div>
            
            {documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderDocumentCards()}
              </div>
            ) : (
              <Empty 
                description="No documents uploaded yet" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
        </TabPane>
        
        {/* Funding Data Tab - Shown only for investors and grant providers */}
        {(user.investor === 2 || user.investor === 3) && (
          <TabPane 
            tab={<span><DollarOutlined className="mr-2" />Funding</span>} 
            key="funding"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  {user.investor === 2 ? "Grant Offerings" : "Investment Portfolio"}
                </h3>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  className="bg-green-600 hover:bg-green-700 border-green-600 text-white"
                  onClick={() => window.location.href = user.investor === 2 ? "/grants/create" : "/capitals/create"}
                >
                  {user.investor === 2 ? "Create Grant" : "Add Investment"}
                </Button>
              </div>
              
              {fundingData.length > 0 ? (
                <Table
                  dataSource={fundingData}
                  columns={fundingColumns}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  className="shadow-sm rounded-lg border border-gray-100"
                />
              ) : (
                <Empty 
                  description={user.investor === 2 ? "No grants available yet" : "No investments available yet"} 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button 
                    type="primary" 
                    className="bg-green-600 hover:bg-green-700 border-green-600 text-white"
                    onClick={() => window.location.href = user.investor === 2 ? "/grants/create" : "/capitals/create"}
                  >
                    {user.investor === 2 ? "Create Your First Grant" : "Create Your First Investment"}
                  </Button>
                </Empty>
              )}
            </div>
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default ProfilePage;