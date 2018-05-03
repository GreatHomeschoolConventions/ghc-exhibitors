/**
 * Exhibitor application form pricingGeneral-
 *
 * @package GHC-Exhibitors
 */

/*global document, jQuery */

(function ($) {
	"use strict";

	/**
	 * Show/hide payment fields as necessary
	 *
	 * @param {object} input selected or changed radio button
	 */
	function handlePaymentFields(input) {
		if (input.val().indexOf('online via credit card') > -1) {
			$('.online-payment').slideDown();
			$('.offline-payment').slideUp();
		} else {
			$('.online-payment').slideUp();
			$('.offline-payment').slideDown();
		}
	}

	/**
	 * Update payment info
	 */
	function updatePaymentInfo() {
		// Set variables.
		var pricingGeneral = [525, 510, 495, 495, 495, 495, 495],
			pricingDiscount = [500, 475, 450, 450, 450, 450, 450],
			discount = new Date() <= new Date('2018-06-01 23:59:59'),
			depositDeadline = new Date() <= new Date('2018-12-15 23:59:59'),
			locationQuantity = $('input[name="locations[]"]:checked').length,
			boothQuantity = 0,
			boothPricingIndex = 0,
			perBoothPrice = 0,
			todaysPayment = 0;

		// Hide early-bird stuff if date is past.
		if (!discount) {
			$('.early-bird').hide();
		}

		// Check for deposit deadline.
		if (!depositDeadline) {
			$('input[name="payment-option"][value*="50%"]').parents('.wpcf7-list-item').remove();
		}

		// Count up number of total booths.
		$('.locations input[name*="quantity"]').each(function () {
			boothQuantity += Number($(this).val());
		});

		// Figure pricing.
		boothPricingIndex = locationQuantity > 0 ? locationQuantity - 1 : 0;
		perBoothPrice = discount ? pricingDiscount[boothPricingIndex] : pricingGeneral[boothPricingIndex];
		todaysPayment = perBoothPrice * boothQuantity;

		// Set total amount.
		$('input[name="quantity"]').val(boothQuantity);
		$('.booth-plural').html(boothQuantity !== 1 ? 's' : '');
		$('.cost-per-booth').html(perBoothPrice);
		$('input[name="total-amount"]').val(todaysPayment);

		// Set today’s payment.
		if ($('input[name="payment-option"]:checked').val().indexOf('50%') > -1) {
			$('input[name="todays-payment"]').val((todaysPayment * 0.5).toFixed(2));
		} else {
			$('input[name="todays-payment"]').val(todaysPayment.toFixed(2));
		}
	}

	$(document).ready(function () {
		// Set up form.
		$('.wpcf7-form-control-wrap.locations label[for*="quantity"]').hide();
		$('input[name="quantity"], input[name="total-amount"], input[name="todays-payment"]').attr('disabled', true);
		$('span.todays-payment').append('<span class="small"> (automatically calculated)</span>');

		// Show/hide individual booth quantities.
		$('input[name="locations[]"]').on('change', function () {
			if ($(this).is(':checked')) {
				$(this).parents('.wpcf7-list-item').find('label.quantity').show().find('input').val(1);
			} else {
				$(this).parents('.wpcf7-list-item').find('label.quantity').hide().find('input').val(0);
			}
		});

		// Handle pluralization.
		$('input.quantity-by-convention').on('keyup', function () {
			$(this).next('.plural').html($(this).val() !== 1 ? 's' : '');
		});

		// Handle changes.
		$('input.quantity-by-convention, input[name="locations[]"], input[name^="quantity"], input[name="payment-option"]').on('change', updatePaymentInfo);

		// Run main function.
		updatePaymentInfo();

		// Show/hide payment fields.
		$('input[name="payment-method"]').on('change', handlePaymentFields($(this)));
		handlePaymentFields($('input[name="payment-method"]:checked'));

		// Re-enable disabled fields prior to form submission.
		$('form.wpcf7-form').on('submit', function () {
			$('input[disabled]').attr('disabled', false);
		});
	});

}(jQuery));
