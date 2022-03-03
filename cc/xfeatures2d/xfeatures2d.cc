#include "opencv_modules.h"

#ifdef HAVE_OPENCV_XFEATURES2D

#include "xfeatures2d.h"
#if CV_VERSION_LOWER_THAN(4, 4, 0)
#include "SIFTDetector.h"
#endif
#include "SURFDetector.h"

NAN_MODULE_INIT(XFeatures2d::Init) {
#if CV_VERSION_LOWER_THAN(4, 4, 0)
	SIFTDetector::Init(target);
#endif
	SURFDetector::Init(target);
};

#endif // HAVE_OPENCV_XFEATURES2D