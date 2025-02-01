"use client";

import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  Button,
  Card,
  Stack,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  Box,
} from "@mui/material";
import DropdownColor from "../organisme/DropdownColor";
import FileUpload from "../organisme/FileUpload";
import { Playlist } from "../../app/page";
import SaveIcon from "@mui/icons-material/Save";

interface PlaylistFormProps {
  initialValues: { name: string };
  isEditing: number | null;
  selectedColor: string | null;
  pochetteUrl: string | null;
  onColorSelect: (color: string) => void;
  onFileSelected: (file: File | null) => void;
  onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => Promise<void>;
  playlists: Playlist[];
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({
  initialValues,
  isEditing,
  selectedColor,
  onColorSelect,
  onFileSelected,
  onSubmit,
  playlists,
}) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().max(255).required("Obligatoire"),
  });

  return (
    <Card className=" w-full p-4 pb-4 flex items-center gap-4 border-t-2">
      <div className="w-full">
        <Formik
          enableReinitialize
          initialValues={
            isEditing
              ? playlists.find((p) => p.id === isEditing) || initialValues
              : initialValues
          }
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values,
          }) => (
            <Form className="w-full" noValidate onSubmit={handleSubmit}>
              <div className="w-full flex gap-4">
                <div className="w-[60%]">
                  <Stack className="w-full" spacing={1}>
                    <InputLabel>Nom de la playliste</InputLabel>
                    <div className="flex gap-4 w-full">
                      <OutlinedInput
                        className={`font-poppins ${
                          errors.name ? "text-left border-none" : "text-left "
                        }`}
                        id="name"
                        type="text"
                        value={values.name}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Nom*"
                        fullWidth
                        size="small"
                        error={Boolean(touched.name && errors.name)}
                        endAdornment={
                          <InputAdornment position="end">
                            {touched.name && errors.name && (
                              <FormHelperText
                                className="z-50 border-none"
                                error
                                id="helper-text-name"
                              >
                                {touched.name && errors.name?.toString()}
                              </FormHelperText>
                            )}
                          </InputAdornment>
                        }
                      />
                      <div className="w-[20%]">
                        <DropdownColor
                          onColorSelect={onColorSelect}
                          selectedColor={selectedColor}
                        />
                      </div>
                    </div>
                  </Stack>
                </div>

                <div className="w-[20%]">
                  <FileUpload onFileSelected={onFileSelected} />
                </div>
                <div className="w-[20%]">
                  <Stack spacing={1}>
                    <InputLabel className=""> _</InputLabel>
                    <Button
                      startIcon={<SaveIcon />}
                      className="w-full"
                      type="submit"
                      variant="contained"
                    >
                      {isEditing
                        ? "Modifier la playlist"
                        : "Enregistrer la playlist"}
                    </Button>
                  </Stack>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Card>
  );
};

export default PlaylistForm;
