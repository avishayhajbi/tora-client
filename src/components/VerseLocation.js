import React, { Component, useEffect, useState } from "react";
import { BooksMap } from "../config";
import { gematriyaNumbers } from "../utils";
import { SPACE } from "../utils";

export const VerseLocation = ({ book, chapter, verse }) => {
  return (
    <span className="font12 fontWeight900">
      <span>ספר</span>
      {SPACE}
      <span>{BooksMap[book]}</span>
      {SPACE}
      |
      {SPACE}
      <span>פרק</span>
      {SPACE}
      <span>{gematriyaNumbers(chapter)}</span>
      {SPACE}
      |
      {SPACE}
      <span>פסוק</span>
      {SPACE}
      <span>{gematriyaNumbers(verse)}</span>
    </span>
  );
};
