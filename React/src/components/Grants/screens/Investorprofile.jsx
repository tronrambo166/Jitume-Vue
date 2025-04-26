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
    const [documents, setDocuments] = useState([
        { id: 1, name: "Business Plan", type: "pdf", status: "complete" },
        {
            id: 2,
            name: "Financial Projections",
            type: "excel",
            status: "complete",
        },
        { id: 3, name: "Pitch Video", type: "video", status: "complete" },
        { id: 4, name: "Team CVs", type: "doc", status: "partial" },
    ]);

    // Enhanced dummy data that matches your API structure
    const dummyUserData = {
        email: "test_to@gmail.com",
        id: 129,
        fname: "Adam",
        lname: "Smith",
        gender: "M",
        image: null,
        investor: 3,
        // Additional profile fields with dummy data
        name: "Adam Smith",
        title: "Founder & CEO",
        company: "Tech Innovations Ltd",
        sector: "Technology",
        location: "Nairobi, Kenya",
        website: "www.techinnovations.co.ke",
        bio: "Passionate about technology solutions for Africa. Building scalable platforms for local businesses.",
        matchScore: 82,
        fundingType: "Equity",
        stage: "Growth Stage",
        teamSize: 8,
        yearsExperience: 5,
        isGenderLed: false,
        isYouthLed: true,
        isRuralBased: false,
        usesLocalSourcing: true,
        profilePhoto: null,
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axiosClient.get("/checkAuth");
                // Merge API data with dummy data for complete profile
                const completeUser = {
                    ...dummyUserData,
                    ...data.user,
                    name: `${data.user.fname} ${data.user.lname || ""}`.trim(),
                };
                setUser(completeUser);
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Fallback to dummy data if API fails
                setUser(dummyUserData);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

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
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleDocumentUpload = (info) => {
        const { status } = info.file;
        if (status !== "uploading") {
            setUploading(true);
        }
        if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
            setUploading(false);
            // Add the new document to the list
            setDocuments([
                ...documents,
                {
                    id: documents.length + 1,
                    name: info.file.name,
                    type: info.file.type.split("/")[1] || "file",
                    status: "complete",
                },
            ]);
        } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
            setUploading(false);
        }
    };

    const getFileIcon = (type) => {
        switch (type) {
            case "pdf":
                return <FilePdfOutlined />;
            case "excel":
                return <FileExcelOutlined />;
            case "doc":
                return <FileWordOutlined />;
            case "image":
                return <FileImageOutlined />;
            default:
                return <FileOutlined />;
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case "complete":
                return (
                    <Tag className="bg-green-50 text-green-600 border-green-100">
                        Complete
                    </Tag>
                );
            case "partial":
                return (
                    <Tag className="bg-orange-50 text-orange-600 border-orange-100">
                        Partial
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

    const fundingTypes = [
        "Equity",
        "Grant",
        "Debt",
        "Convertible Note",
        "Equity & Grants",
    ];
    const stages = [
        "Idea Stage",
        "Pre-Seed",
        "Seed Stage",
        "Growth Stage",
        "Scale Stage",
    ];

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-start gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Badge
                            count={
                                <div
                                    className="bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 shadow-sm"
                                    onClick={triggerFileInput}
                                >
                                    <CameraOutlined className="text-gray-600" />
                                </div>
                            }
                            offset={[-10, 100]}
                        >
                            {user?.image ? ( // Check if user.image exists
                                <Avatar
                                    size={120}
                                    src={user.image} // Use the actual image URL
                                    className="border-2 border-white shadow"
                                />
                            ) : user?.fname || user?.lname ? ( // If no image but has name
                                <Avatar
                                    size={120}
                                    src={`https://ui-avatars.com/api/?name=${
                                        user.fname || ""
                                    }${
                                        user.lname ? `+${user.lname}` : ""
                                    }&background=random&size=128`}
                                    className="bg-gray-200 border-2 border-white shadow"
                                />
                            ) : (
                                // Fallback for no image and no name
                                <Avatar
                                    size={120}
                                    icon={<UserOutlined />}
                                    className="bg-gray-200 border-2 border-white shadow"
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
                    <div className="flex-1">
                        {editing ? (
                            <Form form={form} layout="vertical">
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
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {user.name}
                                </h1>
                                <p className="text-gray-600">
                                    {user.title || "Member"}
                                </p>
                                {user.company && (
                                    <p className="text-green-600 font-medium">
                                        <BankOutlined className="mr-2" />{" "}
                                        {user.company}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-center bg-white p-4 rounded-lg border border-gray-200">
                    <Progress
                        type="circle"
                        percent={user.matchScore || 0}
                        strokeColor="#10B981"
                        format={(percent) => `${percent}%`}
                        width={100}
                        trailColor="#E5E7EB"
                    />
                    <p className="font-medium text-gray-600 mt-2">
                        Funding Match Score
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {editing ? (
                    <>
                        <Form.Item name="sector" className="m-0">
                            <Select
                                style={{ width: 180 }}
                                placeholder="Select Sector"
                            >
                                <Option value="Renewable Energy">
                                    Renewable Energy
                                </Option>
                                <Option value="Agriculture">Agriculture</Option>
                                <Option value="Technology">Technology</Option>
                                <Option value="Healthcare">Healthcare</Option>
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
                            <Tag
                                icon={<TrophyOutlined />}
                                className="bg-gray-100 text-gray-700 border-gray-200"
                            >
                                {user.sector}
                            </Tag>
                        )}
                        {user.fundingType && (
                            <Tag
                                icon={<DollarOutlined />}
                                className="bg-gray-100 text-gray-700 border-gray-200"
                            >
                                {user.fundingType}
                            </Tag>
                        )}
                        {user.stage && (
                            <Tag
                                icon={<TeamOutlined />}
                                className="bg-gray-100 text-gray-700 border-gray-200"
                            >
                                {user.stage}
                            </Tag>
                        )}
                        {user.isGenderLed && (
                            <Tag
                                icon={<SafetyOutlined />}
                                className="bg-green-50 text-green-600 border-green-100"
                            >
                                Women-Led
                            </Tag>
                        )}
                        {user.isYouthLed && (
                            <Tag
                                icon={<SafetyOutlined />}
                                className="bg-green-50 text-green-600 border-green-100"
                            >
                                Youth-Led
                            </Tag>
                        )}
                        {user.isRuralBased && (
                            <Tag
                                icon={<SafetyOutlined />}
                                className="bg-green-50 text-green-600 border-green-100"
                            >
                                Rural-Based
                            </Tag>
                        )}
                        {user.usesLocalSourcing && (
                            <Tag
                                icon={<SafetyOutlined />}
                                className="bg-green-50 text-green-600 border-green-100"
                            >
                                Local Sourcing
                            </Tag>
                        )}
                    </>
                )}
            </div>

            <div className="flex justify-end mb-6">
                <Button
                    type={editing ? "default" : "primary"}
                    icon={editing ? <SaveOutlined /> : <EditOutlined />}
                    onClick={toggleEdit}
                    className={
                        editing
                            ? "border-gray-300"
                            : "bg-green-600 hover:bg-green-700 border-green-600"
                    }
                >
                    {editing ? "Save Profile" : "Edit Profile"}
                </Button>
                {editing && (
                    <Button
                        icon={<CloseOutlined />}
                        onClick={() => setEditing(false)}
                        className="ml-2 border-gray-300"
                    >
                        Cancel
                    </Button>
                )}
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="bg-white rounded-lg p-4 border border-gray-200"
            >
                <TabPane tab="Profile" key="profile">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card
                            title="Basic Information"
                            className="border-0 shadow-none"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <span className="flex items-center text-gray-600 font-medium w-32 flex-shrink-0">
                                        <MailOutlined className="mr-2" /> Email:
                                    </span>
                                    {editing ? (
                                        <Form.Item
                                            name="email"
                                            rules={[
                                                {
                                                    type: "email",
                                                    message:
                                                        "Please enter a valid email!",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    ) : (
                                        <span>{user.email}</span>
                                    )}
                                </div>
                                <div className="flex items-start">
                                    <span className="flex items-center text-gray-600 font-medium w-32 flex-shrink-0">
                                        <GlobalOutlined className="mr-2" />{" "}
                                        Website:
                                    </span>
                                    {editing ? (
                                        <Form.Item name="website">
                                            <Input addonBefore="https://" />
                                        </Form.Item>
                                    ) : (
                                        <span>{user.website}</span>
                                    )}
                                </div>
                                <div className="flex items-start">
                                    <span className="flex items-center text-gray-600 font-medium w-32 flex-shrink-0">
                                        <BankOutlined className="mr-2" />{" "}
                                        Location:
                                    </span>
                                    {editing ? (
                                        <Form.Item name="location">
                                            <Input />
                                        </Form.Item>
                                    ) : (
                                        <span>{user.location}</span>
                                    )}
                                </div>
                                <div className="flex items-start">
                                    <span className="flex items-center text-gray-600 font-medium w-32 flex-shrink-0">
                                        <TeamOutlined className="mr-2" /> Team
                                        Size:
                                    </span>
                                    {editing ? (
                                        <Form.Item name="teamSize">
                                            <Input type="number" min="1" />
                                        </Form.Item>
                                    ) : (
                                        <span>{user.teamSize} members</span>
                                    )}
                                </div>
                                <div className="flex items-start">
                                    <span className="flex items-center text-gray-600 font-medium w-32 flex-shrink-0">
                                        <TrophyOutlined className="mr-2" />{" "}
                                        Experience:
                                    </span>
                                    {editing ? (
                                        <Form.Item name="yearsExperience">
                                            <Input type="number" min="0" />
                                        </Form.Item>
                                    ) : (
                                        <span>
                                            {user.yearsExperience} years
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <Card title="About" className="border-0 shadow-none">
                            {editing ? (
                                <Form.Item name="bio">
                                    <TextArea rows={6} />
                                </Form.Item>
                            ) : (
                                <p className="text-gray-700 whitespace-pre-line">
                                    {user.bio}
                                </p>
                            )}
                        </Card>
                    </div>
                </TabPane>

                <TabPane tab="Funding" key="funding">
                    <div className="grid grid-cols-1 gap-6">
                        <Card
                            title="Grant Applications"
                            className="border-0 shadow-none"
                        >
                            <div className="mb-6 pb-4 border-b border-gray-100">
                                <h3 className="text-base font-medium mb-2">
                                    Renewable Energy Development Fund
                                </h3>
                                <Tag className="bg-gray-100 text-gray-700 border-gray-200 mb-3">
                                    Agriculture & Energy
                                </Tag>
                                <Progress
                                    percent={75}
                                    strokeColor="#10B981"
                                    trailColor="#E5E7EB"
                                    className="mb-2"
                                />
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Match: 92% (Ideal)</span>
                                    <span>Status: Under Review</span>
                                </div>
                            </div>
                            <div className="pb-4">
                                <h3 className="text-base font-medium mb-2">
                                    African Tech Innovation Grant
                                </h3>
                                <Tag className="bg-gray-100 text-gray-700 border-gray-200 mb-3">
                                    Tech
                                </Tag>
                                <Progress
                                    percent={100}
                                    strokeColor="#10B981"
                                    trailColor="#E5E7EB"
                                    className="mb-2"
                                />
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Match: 87% (Ideal)</span>
                                    <span>Status: Awarded ($25,000)</span>
                                </div>
                            </div>
                        </Card>

                        <Card
                            title="Investment Opportunities"
                            className="border-0 shadow-none"
                        >
                            <div className="pb-4">
                                <h3 className="text-base font-medium mb-2">
                                    Green Ventures Capital
                                </h3>
                                <Tag className="bg-gray-100 text-gray-700 border-gray-200 mb-3">
                                    Equity Investment
                                </Tag>
                                <Progress
                                    percent={60}
                                    strokeColor="#10B981"
                                    trailColor="#E5E7EB"
                                    className="mb-2"
                                />
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Match: 83% (Ideal)</span>
                                    <span>Status: Term Sheet Received</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabPane>

                <TabPane tab="Documents" key="documents">
                    <Card
                        title="Your Documents"
                        className="border-0 shadow-none"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="text-3xl mb-2 text-green-600">
                                        {getFileIcon(doc.type)}
                                    </div>
                                    <span className="text-center text-sm">
                                        {doc.name}
                                    </span>
                                    {getStatusTag(doc.status)}
                                </div>
                            ))}
                        </div>
                        <Upload
                            name="document"
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // Mock upload URL
                            onChange={handleDocumentUpload}
                            showUploadList={false}
                            disabled={uploading}
                        >
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                className="bg-green-600 hover:bg-green-700 border-green-600"
                                loading={uploading}
                            >
                                Upload New Document
                            </Button>
                        </Upload>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ProfilePage;
