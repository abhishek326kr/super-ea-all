import { useState } from 'react';
import { Box, IconButton, useTheme, MobileStepper } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

interface ImageSlideshowProps {
    images: string[];
}

const ImageSlideshow = ({ images }: ImageSlideshowProps) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = images.length;

    if (!images || images.length === 0) return null;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
    };

    return (
        <Box sx={{
            width: '100%',
            flexGrow: 1,
            position: 'relative',
            bgcolor: '#0F1D32',
            borderRadius: 3,
            overflow: 'hidden',
            mb: 3,
            border: '1px solid rgba(255,255,255,0.06)'
        }}>
            <Box
                sx={{
                    height: 500, // Fixed height for "big" look
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                }}
            >
                <Box
                    component="img"
                    sx={{
                        height: '100%',
                        maxWidth: '100%',
                        display: 'block',
                        objectFit: 'contain',
                    }}
                    src={images[activeStep]}
                    alt={`Slide ${activeStep + 1}`}
                    onError={(e: any) => {
                        // If image fails, maybe show a placeholder or just hide it
                        e.target.style.display = 'none';
                    }}
                />
            </Box>

            {/* Navigation Arrows - Only if more than 1 image */}
            {maxSteps > 1 && (
                <>
                    <IconButton
                        size="large"
                        onClick={handleBack}
                        sx={{
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(10, 22, 40, 0.7)',
                            backdropFilter: 'blur(4px)',
                            color: 'white',
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.3)' }
                        }}
                    >
                        <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton
                        size="large"
                        onClick={handleNext}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(10, 22, 40, 0.7)',
                            backdropFilter: 'blur(4px)',
                            color: 'white',
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.3)' }
                        }}
                    >
                        <KeyboardArrowRight />
                    </IconButton>

                    {/* Stepper Dots */}
                    <Box sx={{ position: 'absolute', bottom: 0, width: '100%', bgcolor: 'rgba(0,0,0,0.3)' }}>
                        <MobileStepper
                            steps={maxSteps}
                            position="static"
                            activeStep={activeStep}
                            variant="dots"
                            sx={{
                                background: 'transparent',
                                justifyContent: 'center',
                                '& .MuiMobileStepper-dot': {
                                    backgroundColor: 'rgba(255,255,255,0.4)'
                                },
                                '& .MuiMobileStepper-dotActive': {
                                    backgroundColor: '#8B5CF6'
                                }
                            }}
                            nextButton={null}
                            backButton={null}
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ImageSlideshow;
