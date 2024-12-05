import { Scan } from "lucide-react";
import { Camera } from "lucide-react";
import khangImage from "../assets/profile-pictures/khangImage.png";
import yuImage from "../assets/profile-pictures/yuImage.png"
import weiImage from "../assets/profile-pictures/weiImage.png";
import kaiImage from "../assets/profile-pictures/kaiImage.png";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about-us"},
  { label: "Features", href: "/#features"}
];

export const aboutUs = [
  {
    user: "Kai Chun Goh",
    image: kaiImage,
    linkedin: "https://www.linkedin.com/in/kai-chun-goh-756430289/",
    github: "https://github.com/GohKaiChun",
  },
  {
    user: "Khang Huynh Bao Duong",
    image: khangImage,
    linkedin: "https://www.linkedin.com/in/huynh-bao-khang-duong-227388251/",
    github: "https://github.com/Khang261002",
  },
  {
    user: "Wei Jin Gnoh",
    image: weiImage,
    linkedin: "https://www.linkedin.com/in/weijingnoh",
    github: "https://github.com/user101623",
  },
  {
    user: "Yu Qing Leong",
    image: yuImage,
    linkedin: "https://www.linkedin.com/in/yu-qing-leong-98b301281/",
    github: "https://github.com/YuQingLeong",
  },
];

export const features = [
  {
    icon: <Camera />,
    text: "Register",
    description:
      "Easily capture user details with a seamless registration process, using intuitive camera integration for a smooth experience.",
  },
  {
    icon: <Scan />,
    text: "Check-in",
    description:
      "Quickly verify and check in users with an efficient scanning feature, designed to streamline entry and track attendance effortlessly.",
  },
];

export const termsAndConditions = [
  { 
    href: "#acceptance-of-terms", 
    text: "1. Acceptance of Terms", 
    description: "By accessing or using the website, you agree to be bound by these terms and conditions, which constitute a legally binding agreement between you and the FRS group."
  },
  { 
    href: "#collection-and-use-of-data", 
    text: "2. Collection and Use of Data", 
    description: "We collect and process your facial landmark coordinates and images ('Data') solely for the purposes of improving our services. Your images will be deleted after use. We prioritize the security and confidentiality of your data and do not disclose it to third parties without your consent."
  },
  { 
    href: "#user-responsibilities", 
    text: "3. User Responsibilities", 
    description: "You are responsible for maintaining the confidentiality of any login information associated with your account. You agree not to use the Website for any unlawful or unauthorized purpose."
  },
  { 
    href: "#disclaimer", 
    text: "4. Disclaimer", 
    description: "The website and its contents are provided on an 'as-is' and 'as-available' basis, without any warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of the Website or any information contained therein."
  },
  { 
    href: "#amendments", 
    text: "5. Amendments", 
    description: "We reserve the right to modify or amend these terms and conditions at any time without prior notice. Any changes will be effective immediately upon posting on the website. Your continued use of the website after any such changes constitutes your acceptance of the revised terms and conditions."
  },
  { 
    href: "#governing-law", 
    text: "6. Governing Law", 
    description: "These terms and conditions shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions."
  },
  { 
    href: "#contact-us", 
    text: "7. Contact Us", 
    description: "If you have any questions or concerns about these terms and conditions, please contact our instructor at huabo.lu@wichita.edu."
  },
];
