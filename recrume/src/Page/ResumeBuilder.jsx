import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Template1 from '../ResumeTemplates/Template1';
import Template2 from '../ResumeTemplates/Template2';
import Template3 from '../ResumeTemplates/Template3';
// import Template4 from '../ResumeTemplates/Template4';
// import Template5 from '../ResumeTemplates/Templatr5';

const templates = {
  1: Template1,
  2: Template2,
  3: Template3,
  // 4: Template4,
  // 5: Template5
};

const steps = [
  'Personal Info',
  'Objective',
  'Skills',
  'Experience',
  'Education',
  'Achievements',
  'Projects',
  'Template',
];

const ResumeFormSlides = () => {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resumeData, setResumeData] = useState({
    personal: {},
    objective: '',
    skills: { technical: [], soft: [] },
    experience: [],
    education: [],
    achievements: [],
    projects: []
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleChange = (section, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: value
    }));
  };

  const slides = [
    // 0. Personal Info
    <Grid container spacing={2}>
      {['fullName', 'email', 'phone', 'address', 'linkedin'].map((field) => (
        <Grid item xs={12} sm={6} key={field}>
          <TextField
            fullWidth
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={resumeData.personal[field] || ''}
            onChange={(e) => handleChange('personal', field, e.target.value)}
          />
        </Grid>
      ))}
    </Grid>,

    // 1. Objective
    <TextField
      fullWidth
      multiline
      rows={4}
      label="Career Objective"
      value={resumeData.objective}
      onChange={(e) => setResumeData((prev) => ({ ...prev, objective: e.target.value }))}
    />,

    // 2. Skills
    <Box>
      <TextField
        fullWidth
        label="Technical Skills (comma separated)"
        value={resumeData.skills.technical.join(', ')}
        onChange={(e) =>
          handleChange('skills', 'technical', e.target.value.split(',').map((s) => s.trim()))
        }
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Soft Skills (comma separated)"
        value={resumeData.skills.soft.join(', ')}
        onChange={(e) =>
          handleChange('skills', 'soft', e.target.value.split(',').map((s) => s.trim()))
        }
      />
    </Box>,

    // 3. Experience
    <Box>
      {resumeData.experience.map((exp, i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            {['jobTitle', 'company', 'location', 'startDate', 'endDate', 'description'].map((f) => (
              <TextField
                key={f}
                fullWidth
                label={f}
                value={exp[f] || ''}
                onChange={(e) => {
                  const updated = [...resumeData.experience];
                  updated[i][f] = e.target.value;
                  handleArrayChange('experience', updated);
                }}
                sx={{ mb: 1 }}
              />
            ))}
          </CardContent>
        </Card>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() => handleArrayChange('experience', [...resumeData.experience, {}])}
        variant="outlined"
      >
        Add Experience
      </Button>
    </Box>,

    // 4. Education
    <Box>
      {resumeData.education.map((edu, i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            {['degree', 'institution', 'startDate', 'endDate', 'grade'].map((f) => (
              <TextField
                key={f}
                fullWidth
                label={f}
                value={edu[f] || ''}
                onChange={(e) => {
                  const updated = [...resumeData.education];
                  updated[i][f] = e.target.value;
                  handleArrayChange('education', updated);
                }}
                sx={{ mb: 1 }}
              />
            ))}
          </CardContent>
        </Card>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() => handleArrayChange('education', [...resumeData.education, {}])}
        variant="outlined"
      >
        Add Education
      </Button>
    </Box>,

    // 5. Achievements
    <Box>
      {resumeData.achievements.map((ach, i) => (
        <TextField
          key={i}
          fullWidth
          label="Achievement"
          value={ach}
          onChange={(e) => {
            const updated = [...resumeData.achievements];
            updated[i] = e.target.value;
            handleArrayChange('achievements', updated);
          }}
          sx={{ mb: 2 }}
        />
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() => handleArrayChange('achievements', [...resumeData.achievements, ''])}
        variant="outlined"
      >
        Add Achievement
      </Button>
    </Box>,

    // 6. Projects
    <Box>
      {resumeData.projects.map((proj, i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            <TextField
              fullWidth
              label="Project Name"
              value={proj.name || ''}
              onChange={(e) => {
                const updated = [...resumeData.projects];
                updated[i] = { ...updated[i], name: e.target.value };
                handleArrayChange('projects', updated);
              }}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              multiline
              label="Description"
              rows={2}
              value={proj.description || ''}
              onChange={(e) => {
                const updated = [...resumeData.projects];
                updated[i] = { ...updated[i], description: e.target.value };
                handleArrayChange('projects', updated);
              }}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Technologies (comma separated)"
              value={proj.technologies || ''}
              onChange={(e) => {
                const updated = [...resumeData.projects];
                updated[i] = { ...updated[i], technologies: e.target.value };
                handleArrayChange('projects', updated);
              }}
            />
          </CardContent>
        </Card>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          handleArrayChange('projects', [...resumeData.projects, { name: '', description: '', technologies: '' }])
        }
        variant="outlined"
      >
        Add Project
      </Button>
    </Box>,

    // 7. Template Selection
    <Box>
    <div className='flex items-center justify-around mb-12'>
      <div>
        <img src='/demo2.jpg' alt="Resume Preview" className="w-60 h-84 hover:scale-150" />
        <p className='text-center text-xl font-semibold mt-2'>Template 1</p>
      </div>
      <div>
        <img src='/demo1.jpg' alt="Resume Preview" className="w-60 h-84 hover:scale-150" />
        <p className='text-center text-xl font-semibold mt-2'>Template 2</p>
      </div>
      <div>
        <img src='/demo3.png' alt="Resume Preview" className="w-60 h-84 hover:scale-150" />
        <p className='text-center text-xl font-semibold mt-2'>Template 3</p>
      </div>
    </div>
      <Typography variant="h6" gutterBottom>Choose a Template</Typography>
      <Grid container spacing={2}>
        {[1, 2, 3].map((id) => (
          <Grid item key={id}>
            <Button
              variant={selectedTemplate === id ? 'contained' : 'outlined'}
              onClick={() => setSelectedTemplate(id)}
            >
              Template {id}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  ];

  const TemplateComponent = templates[selectedTemplate];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      {selectedTemplate ? (
        <TemplateComponent resumeData={resumeData} />
      ) : (
        <>
          <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box>{slides[step]}</Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              disabled={step === 0}
              onClick={handlePrev}
              variant="outlined"
              startIcon={<NavigateBeforeIcon />}
            >
              Previous
            </Button>
            <Button
              disabled={step === slides.length - 1}
              onClick={handleNext}
              variant="contained"
              endIcon={<NavigateNextIcon />}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ResumeFormSlides;
