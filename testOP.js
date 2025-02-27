const asyncHandler = require('../Middlewares/asyncHandler');
const httpStatusText = require('../Utils/httpStatusText');
const appError = require('../Utils/appError');
const Opportunity = require('../Models/Users/opportunityModel');
const User = require('../Models/Users/userModel');
const Review = require('../Models/Reviews/reviewModel');
const mongoose = require('mongoose');

// 1. إدارة الفرص الأساسية
const addOpportunity = asyncHandler(async (req, res, next) => {
    const { title, type, field, applicationStatus, deadline, eligibilityCriteria } = req.body;

    // التحقق من التكرار باستخدام عنوان مخصص
    const existingOpportunity = await Opportunity.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') });
    if (existingOpportunity) {
        return next(appError.create('الفرصة موجودة مسبقًا بنفس العنوان', 400, httpStatusText.FAIL));
    }

    const newOpportunity = await Opportunity.create({
        title,
        type,
        field,
        applicationStatus,
        deadline,
        eligibilityCriteria
    });

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { opportunity: newOpportunity }
    });
});

const getOpportunityById = asyncHandler(async (req, res, next) => {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
        return next(appError.create('الفرصة غير موجودة', 404, httpStatusText.FAIL));
    }
    res.json({ status: httpStatusText.SUCCESS, data: { opportunity } });
});

const updateOpportunityById = asyncHandler(async (req, res, next) => {
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!updatedOpportunity) {
        return next(appError.create('الفرصة غير موجودة', 404, httpStatusText.FAIL));
    }
    res.json({ status: httpStatusText.SUCCESS, data: { opportunity: updatedOpportunity } });
});

const deleteOpportunityById = asyncHandler(async (req, res, next) => {
    const deletedOpportunity = await Opportunity.findByIdAndDelete(req.params.id);
    if (!deletedOpportunity) {
        return next(appError.create('الفرصة غير موجودة', 404, httpStatusText.FAIL));
    }
    res.json({ status: httpStatusText.SUCCESS, data: null });
});

// 2. نظام البحث المتقدم
const searchOpportunities = asyncHandler(async (req, res, next) => {
    const {
        query,
        type,
        field,
        mode,
        eligibility,
        deadline,
        page = 1,
        limit = 10
    } = req.query;

    // بناء الفلتر الأساسي
    const filter = {};

    // البحث النصي مع دعم التشكيل
    if (query) {
        filter.$text = { $search: query };
    }

    // تطبيق الفلاتر
    const filtersMapping = {
        type,
        field,
        mode,
        eligibility: eligibility?.split(','),
        deadline
    };

    Object.entries(filtersMapping).forEach(([key, value]) => {
        if (value) filter[key] = Array.isArray(value) ? { $in: value } : value;
    });

    // ترتيب النتائج
    const sortOptions = {
        'relevance': { score: { $meta: 'textScore' } },
        'newest': { createdAt: -1 },
        'closing-soon': { deadline: 1 },
        'popular': { applicationsCount: -1 }
    }[req.query.sort] || { createdAt: -1 };

    // التنفيذ مع Pagination
    const [results, total] = await Promise.all([
        Opportunity.find(filter)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Opportunity.countDocuments(filter)
    ]);

    res.json({
        status: httpStatusText.SUCCESS,
        count: results.length,
        total,
        page: +page,
        pages: Math.ceil(total / limit),
        data: results
    });
});

// 3. النظام التوصيات الشخصية
const getPersonalizedRecommendations = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
        .populate({
            path: 'applications.opportunity',
            select: 'tags'
        });

    // استخراج الاهتمامات من سجل المستخدم
    const userInterests = [
        ...new Set([
            ...user.preferences.preferredFields,
            ...user.preferences.preferredTypes,
            ...user.applications.flatMap(app => app.opportunity.tags)
        ])
    ];

    // خوارزمية التوصية
    const recommendations = await Opportunity.aggregate([
        {
            $match: {
                _id: { $nin: user.preferences.excludedOpportunities },
                tags: { $in: userInterests }
            }
        },
        {
            $addFields: {
                matchScore: {
                    $size: { $setIntersection: ["$tags", userInterests] }
                }
            }
        },
        { $sort: { matchScore: -1, deadline: 1 } },
        { $limit: 10 }
    ]);

    res.json({ status: httpStatusText.SUCCESS, data: recommendations });
});

// 4. نظام التقييمات
const calculateRatings = asyncHandler(async (req, res, next) => {
    const { opportunityId } = req.params;

    const ratingSummary = await Review.aggregate([
        { $match: { opportunity: mongoose.Types.ObjectId(opportunityId) } },
        {
            $group: {
                _id: null,
                average: { $avg: '$score' },
                count: { $sum: 1 }
            }
        }
    ]);

    if (!ratingSummary.length) {
        return next(appError.create('لا توجد تقييمات لهذه الفرصة', 404, httpStatusText.FAIL));
    }

    await Opportunity.findByIdAndUpdate(opportunityId, {
        rating: {
            average: ratingSummary[0].average.toFixed(1),
            count: ratingSummary[0].count
        }
    });

    res.json({ status: httpStatusText.SUCCESS });
});

module.exports = {
    addOpportunity,
    getOpportunityById,
    updateOpportunityById,
    deleteOpportunityById,
    searchOpportunities,
    getPersonalizedRecommendations,
    calculateRatings
};
