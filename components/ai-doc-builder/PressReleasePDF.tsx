import type React from "react";
import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import HTMLtoReact from "html-to-react";
import { marked } from "marked";

// Initialize the HTML-to-React parser
const htmlToReactParser = new (HTMLtoReact as any).Parser();

// Convert Markdown to HTML
const convertMarkdownToHtml = (markdown: string) => {
  return marked(markdown);
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    fontFamily: "Helvetica",
    fontSize: 12,
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeadlineText: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 10,
    textAlign: "center",
  },
  date: {
    fontSize: 14,
    marginBottom: 20,
  },
  content: {
    marginTop: 10,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bullet: {
    width: 10,
    fontSize: 12,
  },
  listItemContent: {
    flex: 1,
  },
  paragraph: {
    marginBottom: 10,
  },
  strong: {
    fontWeight: "bold",
  },
  em: {
    fontStyle: "italic",
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  link: {
    color: "blue",
    textDecoration: "underline",
  },
  unorderedList: {
    marginBottom: 10,
  },
  orderedList: {
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginVertical: 10,
  },
  spacer: {
    marginTop: 10,
    marginBottom: 10,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bulletText: {
    flexDirection: "row",
    textAlign: "left", // Ensure text aligns properly
  },
  bulletKey: {
    fontStyle: "bold",
  },
});

const convertHtmlToRichText = (html: string, style?: object) => {
  const elements = htmlToReactParser.parse(html);

  const elementsArray = Array.isArray(elements) ? elements : [elements];

  return elementsArray.map((element, index) => {
    if (!element || !element.type || !element.props) {
      return null;
    }

    const { type, props } = element;

    // Apply the custom style if passed
    const elementStyle = style ? { ...style } : {};

    switch (type) {
      case "p":
        return (
          <Text key={index} style={[styles.paragraph, elementStyle]}>
            {props.children}
          </Text>
        );
      case "strong":
        return (
          <Text key={index} style={[styles.strong, elementStyle]}>
            {props.children}
          </Text>
        );
      case "em":
        return (
          <Text key={index} style={[styles.em, elementStyle]}>
            {props.children}
          </Text>
        );
      case "h1":
        return (
          <Text key={index} style={[styles.h1, elementStyle]}>
            {props.children}
          </Text>
        );
      case "h2":
        return (
          <Text key={index} style={[styles.h2, elementStyle]}>
            {props.children}
          </Text>
        );
      case "ul":
        return (
          <View key={index} style={[styles.unorderedList, elementStyle]}>
            {props.children}
          </View>
        );
      case "ol":
        return (
          <View key={index} style={[styles.orderedList, elementStyle]}>
            {props.children}
          </View>
        );
      case "li":
        return (
          <View key={index} style={[styles.listItem, elementStyle]}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listItemContent}>{props.children}</Text>
          </View>
        );
      case "a":
        return (
          <Text key={index} style={[styles.link, elementStyle]}>
            {props.children}
          </Text>
        );
      default:
        if (typeof element === "string") {
          return <Text key={index}>{element}</Text>;
        }
        return null;
    }
  });
};


const RichTextWithHTML: React.FC<{ content: string, style?: object }> = ({ content, style }) => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const convertContent = async () => {
      const html = await convertMarkdownToHtml(content);
      setHtmlContent(html);
    };

    convertContent();
  }, [content]);

  const parsedContent = convertHtmlToRichText(htmlContent, style);

  return <>{parsedContent}</>;
};

interface PressReleasePDFProps {
  title: string;
  date: string;
  content: string;
  subHeadline: string;
  keyHighlights: string;
  ceoQuote: string;
  ceoName: string;
  companyDescriptor: string;
  aboutCompany: string;
  companyName: string;
  cautionaryNote: string;
  companyInvestorRelationsCompanyName: string;
  companyInvestorRelationsContactEmail: string;
  companyInvestorRelationsContactName: string;
  companyInvestorRelationsContactPhone: string;
  companyContactEmail: string;
  companyContactName: string;
}

const PressReleasePDF: React.FC<PressReleasePDFProps> = ({
  title,
  date,
  content,
  subHeadline,
  keyHighlights,
  ceoQuote,
  ceoName,
  aboutCompany,
  cautionaryNote,
  companyContactEmail,
  companyContactName,
  companyName,
  companyInvestorRelationsCompanyName,
  companyInvestorRelationsContactEmail,
  companyInvestorRelationsContactName,
  companyInvestorRelationsContactPhone,
}) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>


        <RichTextWithHTML content={`${subHeadline}`} style={styles.subHeadlineText} />


        <View style={styles.spacer} />

        <RichTextWithHTML content={`${content}`} />
        <View style={styles.spacer} />

        <Text style={styles.title}>Key Highlights</Text>
        {/* Render key highlights */}

        <RichTextWithHTML content={`${keyHighlights}`} />

        <View style={styles.spacer} />

        <Text style={styles.content}>
          {ceoName}, CEO of {companyName} expressed, "
          {ceoQuote.charAt(0).toLowerCase() + ceoQuote.slice(1)}"
        </Text>

        <View style={styles.spacer} />

        <Text style={styles.title}>About {companyName}</Text>
        <Text style={styles.content}>{aboutCompany}</Text>

        <Text style={styles.title}>Forward Looking Statements</Text>
        <Text style={styles.content}>{cautionaryNote}</Text>

        <Text style={styles.title}>Contact Information</Text>
        <Text style={styles.content}>
          {companyContactName}, {companyName}
        </Text>
        <Text style={styles.content}>Email: {companyContactEmail}</Text>

        <Text style={styles.title}>Investor Relations</Text>
        <Text style={styles.content}>
          {companyInvestorRelationsContactName},{" "}
          {companyInvestorRelationsCompanyName}
        </Text>
        <Text style={styles.content}>
          Email: {companyInvestorRelationsContactEmail}
        </Text>
        <Text style={styles.content}>
          Phone: {companyInvestorRelationsContactPhone}
        </Text>
      </View>
    </Page>
  </Document>
);

export default PressReleasePDF;
