"use client";

import useCategories from "../useCategories.js";
import AttributeSection from "./AttributeSection.jsx";

const CategoryManagement = () => {
  const {
    action,
    actualCategoryTitle,
    categoryTitle,
    handleCategoryTitle,
    levels,
    selectedLevel,
    handleSelectedLevel,
    parents,
    selectedParent,
    handleParent,
    navbar,
    setNavbar,
    errors,
    submitCategory,
    deleteCategory,
    setAttributeCollection,
  } = useCategories();

  return (
    <main className="flex gap-6 pb-4">
      <section className="w-7/12 flex flex-col gap-6">
        {/* title section */}
        <div className="section--category__name a-section--box">
          <div className="flex justify-between items-center">
            <div className="category-name__label a-section--title">
              Category Name
            </div>
            {errors.categoryTitle && (
              <div className="a-text--error">{errors.categoryTitle}</div>
            )}
          </div>

          <input
            type="text"
            className="a-input"
            placeholder="Eg: Electronics"
            value={categoryTitle}
            onChange={(e) => handleCategoryTitle(e.target.value)}
          />
        </div>
        {/* category level selections */}
        <div className="a-section--box">
          <div className="flex items-center justify-between">
            <div className="a-section--title">Select the Category Level</div>
            {errors.parent && (
              <div className="a-text--error">{errors.parent}</div>
            )}
          </div>

          <div className="flex gap-12">
            {levels.map((level) => (
              <div className="flex items-center gap-2">
                <input
                  checked={selectedLevel === level}
                  type="radio"
                  name="level"
                  id={`level ${level}`}
                  onChange={() => handleSelectedLevel(level)}
                />
                <label htmlFor={`level ${level}`} className="a-text--label">
                  Level {level}
                </label>
              </div>
            ))}
          </div>
          <ul className="mt-8 space-y-1">
            <li className="a-text--sub">
              - Note that, <span className="font-semibold">Level 1</span> is the{" "}
              <span className="font-semibold">highest category level</span>.
            </li>
            <li className="a-text--sub">
              - By default, all{" "}
              <span className="font-semibold">new categories</span> are
              automatically{" "}
              <span className="font-semibold">added under level 1.</span> You
              can choose a different level.{" "}
            </li>
          </ul>
        </div>
        {/* parents */}
        {selectedLevel !== 1 && (
          <div className="a-section--box">
            <div className="a-section--title">
              Select the parent for your currenct category
            </div>
            <div className="flex gap-4 flex-wrap">
              {parents.length > 0 &&
                parents.map((parent) => {
                  if (parent.title !== actualCategoryTitle)
                    return (
                      <div
                        className="flex items-center gap-2 p-2 bg-neutral-100 rounded-[.3rem]"
                        key={parent._id}
                      >
                        <input
                          type="radio"
                          name="parent"
                          id={parent._id}
                          onChange={() => handleParent(parent._id)}
                          checked={parent._id === selectedParent}
                        />
                        <label
                          className="a-text--label font-medium"
                          htmlFor={parent._id}
                        >
                          {parent.title}
                        </label>
                      </div>
                    );
                })}
            </div>
          </div>
        )}

        <div className="a-section--box flex justify-between gap-4">
          <div className="flex items-center gap-3 a-section--title">
            <div>Make this category available in menu bar</div>
            <input
              type="checkbox"
              name="navbar"
              id="navbar"
              className="w-6 h-6"
              checked={navbar}
              onChange={() => setNavbar(!navbar)}
            />
          </div>
          <div className="flex items-center gap-4">
            {action === "update" && (
              <div
                className="a-text--button bg-red-800 hover:bg-black text-white !normal-case transition"
                onClick={() => deleteCategory()}
              >
                Delete this category
              </div>
            )}
            <button
              name="update"
              className="submit_button a-text--button text-white bg-[#176eb1] hover:bg-black !py-3 transition !normal-case"
              onClick={submitCategory}
            >
              {action === "update" ? "Update category" : "Create category"}
            </button>
          </div>
        </div>
      </section>
      <AttributeSection setCollection={setAttributeCollection} />
    </main>
  );
};

export default CategoryManagement;
