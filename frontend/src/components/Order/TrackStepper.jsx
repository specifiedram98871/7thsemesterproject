import { Step, StepLabel, Stepper } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { formatDate, getCanonicalOrderStatus, getFinalOrderStatus } from '../../utils/functions';

const TrackStepper = ({ orderStatus, orderType, orderOn, deliveredAt }) => {

    const normalizedStatus = getCanonicalOrderStatus(orderStatus, orderType);
    const finalStatus = getFinalOrderStatus(orderType);
    const activeStep = normalizedStatus === "Processing" ? 1 : normalizedStatus === finalStatus ? 2 : 0;

    const steps = [
        {
            status: "Ordered",
            dt: formatDate(orderOn),
        },
        {
            status: "Processing",
            dt: "",
        },
        {
            status: finalStatus,
            dt: formatDate(deliveredAt),
        },
    ];

    const completedIcon = <span className="text-primary-green animate-pulse"><CircleIcon sx={{ fontSize: "16px" }} /></span>;
    const pendingIcon = <span className="text-gray-400"><CircleIcon sx={{ fontSize: "16px" }} /></span>;

    return (
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((item, index) => (
                <Step
                    key={index}
                    active={activeStep === index ? true : false}
                    completed={activeStep >= index ? true : false}
                >
                    <StepLabel
                        icon={
                            activeStep >= index ? completedIcon : pendingIcon
                        }
                    >
                        {activeStep >= index ? (
                            <div className="flex flex-col">
                                <span className="text-primary-green font-medium">{item.status}</span>
                                {item.dt !== "Invalid Date" && (
                                    <span className="text-primary-green font-medium">{item.dt}</span>
                                )}
                            </div>
                        ) : (
                            <span className="text-gray-400 font-medium">{item.status}</span>
                        )}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    );
};

export default TrackStepper;
