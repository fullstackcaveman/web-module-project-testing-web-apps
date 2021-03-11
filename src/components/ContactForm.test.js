import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', () => {
	render(<ContactForm />);
});

test('renders the contact form header', () => {
	render(<ContactForm />);
	const formHeader = screen.getByText('Contact Form');
	expect(formHeader).toBeInTheDocument();
	expect(formHeader).toBeTruthy();
	expect(formHeader).toContainHTML('Contact Form');
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
	render(<ContactForm />);
	const firstNameInput = screen.getByLabelText('First Name*');

	userEvent.type(firstNameInput, 'abc');

	await waitFor(() => {
		const fNameError = screen.queryByText(
			'Error: firstName must have at least 5 characters.'
		);
		expect(fNameError).toBeInTheDocument();
	});
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
	render(<ContactForm />);

	const submitBtn = screen.getByRole('button');
	userEvent.click(submitBtn);

	await waitFor(() => {
		const fNameError = screen.queryByText(
			'Error: firstName must have at least 5 characters.'
		);
		const lNameError = screen.queryByText(
			'Error: lastName is a required field.'
		);
		const emailError = screen.queryByText(
			'Error: email must be a valid email address.'
		);

		expect(fNameError).toBeInTheDocument();
		expect(lNameError).toBeInTheDocument();
		expect(emailError).toBeInTheDocument();
	});
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
	render(<ContactForm />);

	const firstNameInput = screen.getByLabelText('First Name*');
	const lastNameInput = screen.getByLabelText('Last Name*');
	const submitBtn = screen.getByRole('button');

	userEvent.type(firstNameInput, 'Chris');
	userEvent.type(lastNameInput, 'Burton');
	userEvent.click(submitBtn);

	await waitFor(() => {
		const emailError = screen.queryByText(
			'Error: email must be a valid email address.'
		);
		expect(emailError).toBeInTheDocument();
	});
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
	render(<ContactForm />);

	const emailInput = screen.getByLabelText('Email*');

	userEvent.type(emailInput, '1');

	await waitFor(() => {
		const emailError = screen.queryByText(
			'Error: email must be a valid email address.'
		);

		expect(emailError).toBeInTheDocument();
	});
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
	render(<ContactForm />);

	const firstNameInput = screen.getByLabelText('First Name*');
	const emailInput = screen.getByLabelText('Email*');
	const submitBtn = screen.getByRole('button');

	userEvent.type(firstNameInput, 'Chris');
	userEvent.type(emailInput, 'chris@chris.com');

	userEvent.click(submitBtn);

	await waitFor(() => {
		const lNameError = screen.queryByText(
			'Error: lastName is a required field.'
		);

		expect(lNameError).toBeInTheDocument();
	});
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
	render(<ContactForm />);

	const firstName = 'Chris';
	const lastName = 'Burton';
	const email = 'chris@chris.com';

	const firstNameInput = screen.getByLabelText('First Name*');
	const lastNameInput = screen.getByLabelText('Last Name*');
	const emailInput = screen.getByLabelText('Email*');
	const submitBtn = screen.getByRole('button');

	userEvent.type(firstNameInput, firstName);
	userEvent.type(lastNameInput, lastName);
	userEvent.type(emailInput, email);

	userEvent.click(submitBtn);

	const submittedFirstName = await screen.findByText(firstName);
	const submittedLastName = await screen.findByText(lastName);
	const submittedEmail = await screen.findByText(email);
	expect(submittedFirstName).toBeInTheDocument();
	expect(submittedLastName).toBeInTheDocument();
	expect(submittedEmail).toBeInTheDocument();

	userEvent.dblClick(emailInput);
	userEvent.type(emailInput, '{del}');

	expect(emailInput).toBeEmpty();
	userEvent.click(submitBtn);
});

test('renders all fields text when all fields are submitted.', async () => {
	render(<ContactForm />);

	const firstName = 'Chris';
	const lastName = 'Burton';
	const email = 'chris@chris.com';

	const firstNameInput = screen.getByLabelText('First Name*');
	const lastNameInput = screen.getByLabelText('Last Name*');
	const emailInput = screen.getByLabelText('Email*');
	const submitBtn = screen.getByRole('button');

	userEvent.type(firstNameInput, firstName);
	userEvent.type(lastNameInput, lastName);
	userEvent.type(emailInput, email);

	userEvent.click(submitBtn);

	const submittedFirstName = await screen.findByText(firstName);
	const submittedLastName = await screen.findByText(lastName);
	const submittedEmail = await screen.findByText(email);
	expect(submittedFirstName).toBeInTheDocument();
	expect(submittedLastName).toBeInTheDocument();
	expect(submittedEmail).toBeInTheDocument();
});
