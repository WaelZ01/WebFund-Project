/* Career Prep Hub - Career Paths page: interactive role matcher (ES6) */
document.addEventListener("DOMContentLoaded", () => {
  const buttons = Array.from(document.querySelectorAll(".interest-btn"));
  const resultBox = document.getElementById("matchResult");
  const titleEl = document.getElementById("matchTitle");
  const descEl = document.getElementById("matchDesc");
  const skillsEl = document.getElementById("matchSkills");
  if (!buttons.length || !resultBox) return;

  const paths = {
    defend: {
      title: "Recommended Track: SOC Analyst & Incident Response",
      desc: "You enjoy investigating alerts, analysing logs and stopping threats. Start by practising packet analysis in Wireshark, exploring SIEM dashboards (such as Splunk or Wazuh labs) and learning how phishing and malware alerts are triaged.",
      skills: "Key skills to highlight on your CV: SIEM log analysis, TCP/IP & DNS, Wireshark, Linux basics, incident documentation."
    },
    network: {
      title: "Recommended Track: Network, Systems & Cloud Engineer",
      desc: "You enjoy building and troubleshooting infrastructure. Focus on routing and switching labs, VLAN segmentation, firewall rules, Linux/Windows Server administration and introductory cloud services (AWS or Azure).",
      skills: "Key skills to highlight on your CV: Subnetting & VLANs, Cisco Packet Tracer, firewall rules, Active Directory, Linux CLI."
    },
    code: {
      title: "Recommended Track: Software / Web Developer",
      desc: "You enjoy creating applications and automating tasks. Build a tidy GitHub portfolio with two or three working web or software projects, practise Git version control and learn secure coding fundamentals (OWASP Top 10).",
      skills: "Key skills to highlight on your CV: HTML5/CSS3/JS, Python or C#, SQL databases, REST APIs, Git & GitHub."
    },
    grc: {
      title: "Recommended Track: GRC (Governance, Risk & Compliance) / IT Business Analyst",
      desc: "You enjoy structure, policy, risk assessment and communication. Organisations in banking, government and telecoms need graduates who understand technical controls and can align them with security frameworks.",
      skills: "Key skills to highlight on your CV: ISO/IEC 27001 awareness, risk assessment, clear technical writing, stakeholder communication."
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-interest");
      const data = paths[key];
      if (!data) return;

      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("btn-clay", active);
        b.classList.toggle("btn-blue", !active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });

      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      skillsEl.textContent = data.skills;
      resultBox.classList.remove("d-none");
    });
  });
});
