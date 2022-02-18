const { Project } = require('../models/project');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

//Get all projects
router.get(`/`, async (req, res) => {
    
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    const projectList = await Project.find(filter).populate('category');

    if (!projectList) {
        res.status(500).json({ success: false });
    }
    res.send({
         projectList
    });
});

//Get project by ID

router.get(`/:id`, async (req, res) => {
    const project = await Project.findById(req.params.id).populate('category');

    if (!project) {
        res.status(500).json({ success: false });
    }
    res.send(project);
});


//Add a projects
router.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    let project = new Project({
        name: req.body.name,
        description: req.body.description,
        url: req.body.url,
        category: req.body.category
    });

    project = await project.save();
    if (!project) return res.status(500).send('The project cannot be created');
    res.send(project);
});

//Update a project
router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Project Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(400).send('Invalid Project!');
    
    const updatedProject = await Project.findOneAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            url: req.body.url
        },
        { new: true }
    );

    if (!updatedProject) return res.status(500).send('the project cannot be updated!');

    res.send(updatedProject);
});

//Delete a project
router.delete('/:id', (req, res) => {
    Project.findByIdAndDelete(req.params.id)
        .then((project) => {
            if (project) {
                return res.status(200).json({
                    success: true,
                    message: 'the project is deleted!'
                });
            } else {
                return res.status(404).json({ success: false, message: 'project not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

// Get total project
router.get(`/get/count`, async (req, res) => {
    const projectCount = await Project.countDocuments((count) => count);

    if (!projectCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        projectCount: projectCount
    });
});


module.exports = router;
