"use client"

import type React from "react"
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer"
import { marked } from "marked"
import { Font } from "@react-pdf/renderer"
import he from "he"

// Register Roboto font with TTF format
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf", fontWeight: "normal" }, // Regular
    { src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf", fontWeight: "bold" }, // Bold
    { src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf", fontWeight: "normal", fontStyle: "italic" }, // Italic
    { src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf", fontWeight: "bold", fontStyle: "italic"  }, // Italic
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    fontFamily: "Roboto",
    fontSize: 14,
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
    fontWeight: "bold",
    fontStyle: "italic",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    marginBottom: 20,
  },
  content: {
    marginTop: 10,
    marginBottom: 10,
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  bullet: {
    fontSize: 12,
    marginRight: 5,
  },
  bulletText: {
    flex: 1,
  },
  paragraph: {
    marginBottom: 10,
  },
  spacer: {
    marginTop: 10,
    marginBottom: 10,
  },
})

interface PressReleasePDFProps {
  title: string
  date: string
  content: string
  subHeadline: string
  keyHighlights: string
  ceoQuote: string
  ceoName: string
  aboutCompany: string
  cautionaryNote: string
  companyInvestorRelationsCompanyName: string
  companyInvestorRelationsContactEmail: string
  companyInvestorRelationsContactName: string
  companyInvestorRelationsContactPhone: string
  companyContactEmail: string
  companyContactName: string
  companyName: string
}

const formatKeyHighlights = (text: string) => {
  return text.split("\n").filter(line => line.trim() !== "")
}

const renderMarkdownText = (markdown: string) => {
  const parsedMarkdown = marked(markdown, { mangle: false, headerIds: false })
    .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
    .trim()
  
    return he.decode(parsedMarkdown) // ✅ Decode HTML entities
    .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
    .trim()

}

const splitIntoParagraphs = (text: string) => {
  return text.split("\n").filter(line => line.trim() !== "")
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
        {/* Title and Date */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>

        {/* Subheadline (Now as an italic paragraph) */}
        {formatKeyHighlights(subHeadline).map((subHeadlinePart, index) => (
          <View key={index} style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.subHeadlineText}>{subHeadlinePart}</Text>
          </View>
        ))}

        {/* Content (Formatted into paragraphs) */}
        {splitIntoParagraphs(renderMarkdownText(content)).map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>{paragraph}</Text>
        ))}

        <View style={styles.spacer} />

        {/* Key Highlights as Bulleted List */}
        <Text style={styles.title}>Key Highlights</Text>
        {formatKeyHighlights(keyHighlights).map((highlight, index) => {
          // Remove leading "1. ", "2. ", etc. from the highlight
          const cleanedHighlight = highlight.replace(/^\d+\.\s*/, "");

          return (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{cleanedHighlight}</Text>
            </View>
          );
        })}

        <View style={styles.spacer} />

        {/* CEO Quote */}
        <Text style={styles.content}>
          {ceoName}, CEO of {companyName}, expressed, "{ceoQuote}"
        </Text>

        <View style={styles.spacer} />

        {/* About Company (Formatted into paragraphs) */}
        <Text style={styles.title}>About {companyName}</Text>
        {splitIntoParagraphs(renderMarkdownText(aboutCompany)).map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>{paragraph}</Text>
        ))}

        <View style={styles.spacer} />

        {/* Forward Looking Statements (Formatted into paragraphs) */}
        <Text style={styles.title}>Forward Looking Statements</Text>
        {splitIntoParagraphs(renderMarkdownText(cautionaryNote)).map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>{paragraph}</Text>
        ))}

        <View style={styles.spacer} />

        {/* Contact Information */}
        <Text style={styles.title}>Contact Information</Text>
        <Text style={styles.content}>
          {companyContactName}, {companyName}
        </Text>
        <Text style={styles.content}>Email: {companyContactEmail}</Text>

        <View style={styles.spacer} />

        {/* Investor Relations */}
        <Text style={styles.title}>Investor Relations</Text>
        <Text style={styles.content}>
          {companyInvestorRelationsContactName}, {companyInvestorRelationsCompanyName}
        </Text>
        <Text style={styles.content}>Email: {companyInvestorRelationsContactEmail}</Text>
        <Text style={styles.content}>Phone: {companyInvestorRelationsContactPhone}</Text>
      </View>
    </Page>
  </Document>
)

export default PressReleasePDF
